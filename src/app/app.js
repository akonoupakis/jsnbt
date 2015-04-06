var deployd = require('deployd');
var jsnbt = require('./jsnbt.js');
var pack = require('./package.js');
var fs = require('./util/fs.js');
var path = require('path');
var moment = require('moment');
var server = require('server-root');
var _ = require('underscore');

exports.hosts = null;

exports.root = null;
exports.path = null;
exports.dbg = false;

exports.cache = null;
exports.logger = null;
exports.server = null;

exports.modules = [];

var startLogging = function (self) { 
    self.logger = require('custom-logger').config({ level: 0 });
    self.logger.new({
        debug: { event: "debug", level: 0, color: "yellow" },
        info: { color: 'cyan', level: 1, event: 'info' },
        notice: { color: 'yellow', level: 2, event: 'notice' },
        warn: { color: 'yellow', level: 3, event: 'warning' },
        error: { color: 'red', level: 4, event: 'error' },
        fatal: { color: 'red', level: 5, event: 'fatal' }
    });
    self.logger.debug('initiating app');

    var errorFn = self.logger.error;
    self.logger.error = function (method, path, err) {
        errorFn(method, path, err);
        fs.appendFileSync('error.log', moment().format() + '-' + method + ' - ' + path + '\n' + err + '\n\n');
    };

    var fatalFn = self.logger.fatal;
    self.logger.fatal = function (err) {
        fatalFn(method, path, err);
        fs.appendFileSync('fatal.log', moment().format() + '-' + method + ' - ' + path + '\n' + err + '\n\n');
    };
}

var registerModules = function (self, module) {
    var coreModule = {
        getConfig: function () {
            return require('./config.js');
        }
    };

    jsnbt.register('core', coreModule);

    if (module) {
        try {
            if (typeof (module.init) == 'function')
                module.init(self);

            var moduleConfig = typeof (module.getConfig) === 'function' ? module.getConfig() : {};

            if (moduleConfig.domain && moduleConfig.domain !== 'core')
                jsnbt.register(moduleConfig.domain, module);

            module.domain = moduleConfig.domain;
            module.public = moduleConfig.public;

            self.modules.push(module);
        }
        catch (err) {
            self.logger.error(err.toString());
        }
    }

    var installedPackages = pack.npm.getInstalled();
    for (var i in installedPackages) {
        if (installedPackages[i] !== 'jsnbt') {
            try {
                var installedModule = require(installedPackages[i]);

                var installedModuleConfig = typeof (installedModule.getConfig) === 'function' ? installedModule.getConfig() : {};

                if (typeof (installedModule.init) == 'function')
                    installedModule.init(self);

                if (installedModuleConfig.domain && installedModuleConfig.domain !== 'core')
                    jsnbt.register(installedPackages[i], installedModule);

                installedModule.domain = installedModuleConfig.domain;
                installedModule.public = installedModuleConfig.public;

                self.modules.push(installedModule);
            }
            catch (err) {
                self.logger.error(err.toString());
            }
        }
    }
}

exports.init = function (env, hosts, module) {
    var self = this;

    process.chdir(env === 'prod' ? 'dist' : 'dev');

    this.hosts = hosts;

    this.root = env == 'prod' ? 'dist' : 'dev';
    this.path = path.join(__dirname, this.root, 'public');
    this.dbg = env != 'prod';

    startLogging(self);
    
    registerModules(self, module);
    
    this.server = deployd({
        port: hosts.port,
        env: env === 'prod' ? 'production' : 'development',
        db: {
            host: hosts.db.host,
            port: hosts.db.port,
            name: hosts.db.name
        },
        events: {
            request: function (req, res) {
                var router = new require('./router.js')();
                router.process(req, res);
            },
            listening: function () {
                self.logger.info('server is listening on ' + hosts.host + ':' + hosts.port);
            },
            "request:error": function (err, req, res) {
                self.logger.error(req.method, req.url, err.stack || err);
                process.exit(1);
            }
        },
        appPath: __dirname
    });

    delete this.init;
};

exports.update = function (env, hosts) {
    var self = this;

    process.chdir(env === 'prod' ? 'dist' : 'dev');

    this.hosts = hosts;

    this.root = env == 'prod' ? 'dist' : 'dev';
    this.path = path.join(__dirname, this.root, 'migrations');
    this.dbg = env != 'prod';

    startLogging(self);

    registerModules(self, module);

    var migrations = [];
    var migrationsCount = 0;

    var migrationsPort = hosts.port - 1;

    var error = function (err) {
        throw err;
        process.exit(1);
    };
    var done = function () {
        process.exit(0);
    };

    var runMigration = function (dpd) {
        var migration = migrations.shift();
        if (migration) {
            dpd.migrations.count({
                module: migration.module,
                name: migration.name
            }, function (result, err) {
                if (err) {
                    runMigration(dpd);
                }
                else {
                    if (result.count === 0) {
                        migration.fn.process(dpd, function () {
                            dpd.migrations.post({
                                module: migration.module,
                                name: migration.name,
                                processedOn: new Date().getTime()
                            }, function (response, err) {
                                if (err) {
                                    self.logger.error(err);
                                    error(err);
                                }
                                else {
                                    self.logger.info('migration processed: ' + migration.module + ', ' + migration.name);
                                    migrationsCount++;
                                    runMigration(dpd);
                                }
                            });                            
                        }, function (err) {
                            self.logger.error(err);
                            error(err);
                        });
                    }
                    else {
                        runMigration(dpd);
                    }
                }
            });
            
            
        }
        else {
            self.logger.info('total migrations processed: ' + migrationsCount);
            done();
        }
    };

    this.server = deployd({
        port: migrationsPort,
        env: env === 'prod' ? 'production' : 'development',
        db: {
            host: hosts.db.host,
            port: hosts.db.port,
            name: hosts.db.name
        },
        events: {
            listening: function () {
                var dpd = require('deployd/lib/internal-client').build(self.server);

                var migrationsPath = self.root + '/migrations';

                if (fs.existsSync(server.getPath(migrationsPath))) {
                    var packageItems = fs.readdirSync(server.getPath(migrationsPath));
                    _.each(packageItems, function (packageItem) {
                        var packageItemPath = migrationsPath + '/' + packageItem;
                        if (fs.lstatSync(server.getPath(packageItemPath)).isDirectory()) {
                            var packageMigrationItems = fs.readdirSync(server.getPath(packageItemPath));
                            
                            _.each(packageMigrationItems, function (packageMigrationItem) {
                                var packageMigrationItemPath = migrationsPath + '/' + packageItem + '/' + packageMigrationItem;
                                if (fs.lstatSync(server.getPath(packageMigrationItemPath)).isFile()) {
                                    
                                    try {
                                        migrations.push({
                                            module: packageItem,
                                            name: packageMigrationItem,
                                            fn: require(server.getPath(packageMigrationItemPath))
                                        });
                                    }
                                    catch (err) {
                                        self.logger.error(err);
                                    }
                                }
                            });
                        }
                    });
                }

                self.logger.info('server is updating migrations on ' + hosts.host + ':' + migrationsPort);
                runMigration(dpd);
            }
        },
        appPath: __dirname
    });

    delete this.update;

    this.server.listen();
};

exports.getBower = function () {
    return require('../web/bower.json');
};

exports.getConfig = function () {
    return require('./config.js');
};

exports.start = function (title) {
    this.title = title;
    this.server.listen();
};