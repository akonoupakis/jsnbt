var deployd = require('deployd');
var dpdSync = require('dpd-sync');
var jsnbt = require('./jsnbt.js');
var pack = require('./package.js');
var fs = require('./utils/fs.js');
var path = require('path');
var moment = require('moment');

exports.root = null;
exports.path = null;
exports.dbg = false;

exports.session = null;
exports.cache = null;
exports.logger = null;
exports.server = null;

exports.dpd = null;

exports.packages = [];

var jsnbtModule = {

    entities: [{
        name: 'page',
        allowed: ['page', 'pointer'],
        localized: true
    }, {
        name: 'pointer',
        allowed: [],
        localized: true
    }],

    roles: [{
        name: 'public',
        inherits: []
    }, {
        name: 'member',
        inherits: ['public']
    }, {
        name: 'admin',
        inherits: ['member']
    }, {
        name: 'translator',
        inherits: ['admin']
    }, {
        name: 'sa',
        inherits: ['admin', 'translator']
    }],

    sections: [{
        name: 'languages',
        roles: ['sa']
    }, {
        name: 'nodes',
        roles: ['admin']
    }, {
        name: 'data',
        roles: ['admin']
    }, {
        name: 'texts',
        roles: ['translator', 'sa']
    }, {
        name: 'files',
        roles: ['admin']
    }, {
        name: 'users',
        roles: ['admin']
    }, {
        name: 'settings',
        roles: ['sa']
    }],

    data: [{
        collection: 'languages',
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'sa',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'nodes',
        permissions: [{
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'nodeurls',
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'drafts',
        permissions: [{
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'data',
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'texts',
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'translator',
            crud: ['R', 'U']
        }, {
            role: 'sa',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'users',
        permissions: [{
            role: 'admin',
            crud: ['C', 'R', 'U']
        }]
    }, {
        collection: 'settings',
        permissions: [{
            role: 'sa',
            crud: ['C', 'R', 'U', 'D']
        }]
    }],

    lists: [{
        name: 'Sample 01',
        spec: '/tmpl/spec/list/sample1.html',
        localized: true,
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        name: 'Sample 02',
        spec: '/tmpl/spec/list/sample2.html',
        localized: false
    }],

};

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

    jsnbt.registerModule('jsnbt', jsnbtModule);

    if (module) {
        try {
            if (typeof (module.init) == 'function')
                module.init(this);

            if (module.domain)
                jsnbt.registerModule(module.domain, module);

            if (module.localization !== undefined) {
                jsnbt.setLocalization(module.localization);
            }

            this.packages.push(module);
        }
        catch (err) {
            this.logger.error(err.toString());
        }
    }

    var installedPackages = pack.npm.getInstalled();
    for (var i in installedPackages) {
        if (installedPackages[i] !== 'jsnbt') {
            try {
                var router = require(installedPackages[i]);

                if (typeof (router.init) == 'function')
                    router.init(this);

                jsnbt.registerModule(installedPackages[i], router);

                this.packages.push(router);
            }
            catch (err) {
                this.logger.error(err.toString());
            }
        }
    }

    this.session = require('session-manager').create({ engine: 'memory' });
    this.cache = require('nodecache');

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
                self.dpd = require('deployd/lib/internal-client').build(self.server);
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