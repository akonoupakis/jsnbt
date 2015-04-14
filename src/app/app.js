var deployd = require('deployd');
var jsnbt = require('./jsnbt.js');
var pack = require('./package.js');
var fs = require('./util/fs.js');
var path = require('path');
var server = require('server-root');
var auth = require('./auth.js');
var _ = require('underscore');

exports.hosts = null;

exports.root = null;
exports.path = null;
exports.dbg = false;

exports.modules = [];

var cache = null;
exports.getCache = function () {
    if (cache === null)
        cache = require('./caching/cache.js')();

    return cache;
};

exports.logger = null;
exports.server = null;

exports.createMailSender = function (server, dpd, success, error) {

    var settings = {
        provider: 'core',
        host: '127.0.0.1',
        username: '',
        password: '',
        port: 21,
        sender: 'info@domain.com',
        cc: [],
        bcc: [],
        ssl: false
    };

    dpd.settings.getCached({
        domain: 'core'
    }, function (res, err) {
        if (err) {
            if (typeof (error) === 'function')
                error(err);
            else
                throw err;
        }
        else {
            var first = _.first(res);

            var opts = {};
            _.extend(opts, settings);
            if(first.data && first.data.messager && first.data.messager.mail)
                _.extend(opts, first.data.messager.mail);

            if (opts.provider !== undefined && opts.provider !== null && opts.provider !== 'null') {
                if (opts.provider === 'core') {
                    var mailSender = require('./messaging/mailSender.js')(opts, dpd);
                    if (typeof (success) === 'function')
                        success(mailSender);
                }
                else {
                    var firstMatchedModule = _.find(app.modules, function (x) { return x.domain === opts.provider; });
                    if (firstMatchedModule && typeof (firstMatchedModule.createMailSender) === 'function') {

                        firstMatchedModule.createMailSender(opts, dpd, function (mailSender) {
                            if (typeof (success) === 'function')
                                success(mailSender);
                        });

                    }
                    else {
                        var err = new Error('mail messager module not found: ' + opts.provider);

                        if (typeof (error) === 'function')
                            error(err);
                        else
                            throw err;                        
                    }
                }
            }
            else {
                var err = new Error('mail messager module not defined');

                if (typeof (error) === 'function')
                    error(err);
                else
                    throw err;
            }
        }
    });

};

exports.createSmsSender = function (server, dpd, success, error) {

    var settings = {
        provider: 'null',
        sender: 'jsnbt'
    };

    dpd.settings.getCached({
        domain: 'core'
    }, function (res, err) {
        if (err) {
            if (typeof (error) === 'function')
                error(err);
            else
                throw err;
        }
        else {
            var first = _.first(res);

            var opts = {};
            _.extend(opts, settings);
            if (first.data && first.data.messager && first.data.messager.sms)
                _.extend(opts, first.data.messager.sms);

            if (opts.provider !== undefined && opts.provider !== null && opts.provider !== 'null') {
                if (opts.provider === 'core') {
                    var mailSender = require('./messaging/smsSender.js')(opts, dpd);
                    if (typeof (success) === 'function')
                        success(mailSender);
                }
                else {
                    var firstMatchedModule = _.find(app.modules, function (x) { return x.domain === opts.provider; });
                    if (firstMatchedModule && typeof (firstMatchedModule.createSmsSender) === 'function') {

                        firstMatchedModule.createSmsSender(opts, dpd, function (mailSender) {
                            if (typeof (success) === 'function')
                                success(mailSender);
                        });

                    }
                    else {
                        var err = new Error('sms messager module not found: ' + opts.provider);
                        if (typeof (error) === 'function')
                            error(err);
                        else
                            throw err;
                    }
                }
            }
            else {
                var err = new Error('sms messager module not defined');
                if (typeof (error) === 'function')
                    error(err);
                else
                    throw err;
            }
        }
    });
};

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
    
    self.logger = require('./logging/logger.js')();
    self.logger.debug('initiating app');
    
    registerModules(self, module);
    
    var logAction = function (dpd, user, collection, action, objectId, objectData, callback) {
        dpd.actions.post({
            timestamp: new Date().getTime(),
            user: user ? user.id : undefined,
            collection: collection,
            action: action,
            objectId: objectId,
            objectData: objectData || {}
        }, function (results, err) {
            if (err) {
                throw err;
            }
            else {
                callback();
            }
        });
    };

    var shouldCheck = function (collection) {
        var result = true;

        var dpdPermissions = _.find(jsnbt.permissions, function (x) { return x.collection === collection; });
        if (dpdPermissions && dpdPermissions.auth === false)
            result = false;
        
        return result;
    };

    self.server = deployd({
        port: hosts.port,
        env: env === 'prod' ? 'production' : 'development',
        db: {
            host: hosts.db.host,
            port: hosts.db.port,
            name: hosts.db.name
        },
        dpd: {
            onPreRead: function (scriptContext, collection, objectId, callback) {
                if (!scriptContext.internal && shouldCheck(collection) && !auth.isAuthorized(scriptContext.me, collection, 'R'))
                    scriptContext.cancel('access denied', 401);
                
                callback();
            },
            onPostRead: function (scriptContext, collection, objectId, objectData, callback) {
                callback();
            },
            onPreCreate: function (scriptContext, collection, objectId, callback) {
                if (!scriptContext.internal && shouldCheck(collection) && !auth.isAuthorized(scriptContext.me, collection, 'C'))
                    scriptContext.cancel('access denied', 401);

                callback();
            },
            onPostCreate: function (scriptContext, collection, objectId, objectData, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'create', objectId, objectData, function () {
                    if (!scriptContext.internal)
                        scriptContext.emit(collection + 'Created', objectData);

                    callback();
                });
            },
            onPreUpdate: function (scriptContext, collection, objectId, callback) {
                if (!scriptContext.internal && shouldCheck(collection) && !auth.isAuthorized(scriptContext.me, collection, 'U'))
                    scriptContext.cancel('access denied', 401);
                
                callback();
            },
            onPostUpdate: function (scriptContext, collection, objectId, objectData, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'update', objectId, objectData, function () {
                    if (!scriptContext.internal)
                        scriptContext.emit(collection + 'Updated', objectData);

                    callback();
                });
            },
            onPreDelete: function (scriptContext, collection, objectId, callback) {
                if (!scriptContext.internal && shouldCheck(collection) && !auth.isAuthorized(scriptContext.me, collection, 'D'))
                    scriptContext.cancel('access denied', 401);

                callback();
            },
            onPostDelete: function (scriptContext, collection, objectId, objectData, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'delete', objectId, objectData, function () {
                    if (!scriptContext.internal)
                        scriptContext.emit(collection + 'Deleted', objectData);

                    callback();
                });
            }
        },
        cache: self.getCache(),
        events: {
            listening: function (a,b) {
                self.logger.info('server is listening on ' + hosts.host + ':' + hosts.port);

            },
            request: function (req, res) {
                var router = new require('./router.js')(self.server);
                router.process(req, res);
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
    
    self.logger = require('./logging/logger.js')();
    self.logger.debug('initiating app');
    
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
        cache: self.getCache(),
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