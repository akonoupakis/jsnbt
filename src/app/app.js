var deployd = require('deployd');
var jsnbt = require('./jsnbt.js');
var pack = require('./package.js');
var fs = require('./utils/fs.js');
var path = require('path');
var moment = require('moment');

exports.root = null;
exports.path = null;
exports.dbg = false;

exports.cache = null;
exports.logger = null;
exports.server = null;

exports.init = function (env, config, module) {
    var self = this;

    process.chdir(env === 'prod' ? 'dist' : 'dev');

    var configSection = config[env];

    if (!configSection)
        throw 'config section for environment "' + env + '" is missing';

    config.host = configSection.host;
    config.port = configSection.port;
    config.env = env;
    config.db = {
        host: configSection.db.host,
        port: configSection.db.port,
        name: configSection.db.name
    };

    delete config.dev;
    delete config.prod;

    this.config = config;

    this.root = config.env == 'prod' ? 'dist' : 'dev';
    this.path = path.join(__dirname, this.root, 'public');
    this.dbg = config.env != 'prod';

    this.logger = require('custom-logger').config({ level: 0 });
    this.logger.new({
        debug: { event: "debug", level: 0, color: "yellow" },
        info: { color: 'cyan', level: 1, event: 'info' },
        notice: { color: 'yellow', level: 2, event: 'notice' },
        warn: { color: 'yellow', level: 3, event: 'warning' },
        error: { color: 'red', level: 4, event: 'error' },
        fatal: { color: 'red', level: 5, event: 'fatal' }
    });
    this.logger.debug('initiating app');

    var errorFn = this.logger.error;
    this.logger.error = function (err) {
        this.debug(arguments.callee.caller.toString());
        errorFn(err.toString());

        fs.createWriteStream('error.log', { 'flags': 'a' }).write(moment().format() + ' ' + err.toString() + "\n");
    };

    var fatalFn = this.logger.fatal;
    this.logger.fatal = function (err) {
        this.debug(arguments.callee.caller.toString());
        fatalFn(err.toString());

        fs.createWriteStream('fatal.log', { 'flags': 'a' }).write(moment().format() + ' ' + err.toString() + "\n");
    };

    var jsnbtModule = {
        domain: 'core',
        getConfig: function () {
            return require('./config.js');
        }
    };

    jsnbt.register('jsnbt', jsnbtModule);

    if (module) {
        try {
            if (typeof (module.init) == 'function')
                module.init(this);

            var moduleConfig = typeof (module.getConfig) === 'function' ? module.getConfig() : {};

            if (moduleConfig.domain && moduleConfig.domain !== 'core')
                jsnbt.register(moduleConfig.domain, module);
        }
        catch (err) {
            this.logger.error(err.toString());
        }
    }

    var installedPackages = pack.npm.getInstalled();
    for (var i in installedPackages) {
        if (installedPackages[i] !== 'jsnbt') {
            try {
                var installedModule = require(installedPackages[i]);

                var installedModuleConfig = typeof (installedModule.getConfig) === 'function' ? installedModule.getConfig() : {};

                if (typeof (installedModule.init) == 'function')
                    installedModule.init(this);
                
                if (installedModuleConfig.domain && installedModuleConfig.domain !== 'core')
                    jsnbt.register(installedPackages[i], installedModule);
            }
            catch (err) {
                this.logger.error(err.toString());
            }
        }
    }

    this.server = deployd({
        port: config.port,
        env: config.env === 'prod' ? 'production' : 'development',
        db: {
            host: config.db.host,
            port: config.db.port,
            name: config.db.name
        },
        events: {
            request: function (req, res) {
                var router = new require('./router.js')();
                router.process(req, res);
            },
            listening: function () {
                self.logger.info('server is listening on ' + config.host + ':' + config.port);
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

exports.start = function (title) {
    this.title = title;
    this.server.listen();
};