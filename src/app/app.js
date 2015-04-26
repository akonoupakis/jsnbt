var fs = require('fs');
var path = require('path');
var extend = require('extend');
var _ = require('underscore');

var Environment = {
    Development: 'dev',
    Production: 'prod'
};

var Directory = {
    Development: 'dev',
    Production: 'dist'
};

var logger = require('./logger.js')(this);

exports.domain = 'core';
exports.public = false;
exports.browsable = false;

exports.environment = Environment.Development;
exports.directory = Directory.Development;

exports.path = null;

exports.dbg = false;

exports.title = 'jsnbt';

exports.modules = {
    core: undefined,
    rest: [],
    public: undefined,
    all: []
};

var getInstalledModules = function () {
    var modules = [];

    var found = fs.readdirSync(require('server-root').getPath('node_modules'));
    for (var i in found) {
        if (found[i].indexOf('jsnbt-') === 0) {
            try {
                var installedModule = require(found[i]);
                if (typeof (installedModule.getVersion) === 'function')
                    installedModule.version = installedModule.getVersion();

                modules.push(installedModule);
            }
            catch (err) {
                logger.fatal(err);
            }
        }
    }

    return modules;
};

exports.init = function (options, module) {
    var self = this;

    var defOpts = {
        title: self.title
    };

    var opts = {};
    extend(true, opts, defOpts, options);

    logger.debug('initiating module: core');

    this.title = opts.title;

    var coreModule = {
        domain: 'core',
        version: self.getVersion(),
        browsable: false,
        getConfig: self.getConfig,
        getBower: self.getBower
    };
    
    this.modules.core = coreModule;
    
    var installedModules = getInstalledModules();
    _.each(installedModules, function (installedModule) {
        self.modules.rest.push(installedModule);
    });

    if (module) {
        if (module.public) {
            module.domain = 'public';
            module.browsable = false;
            self.modules.public = module;
        }
        else {
            self.modules.rest.push(module);
        }
    }

    self.modules.all.push(self.modules.core);
    _.each(self.modules.rest, function (installedModule) {
        self.modules.all.push(installedModule);
    });
    if (self.modules.public)
        self.modules.all.push(self.modules.public);


    var jsnbt = require('./jsnbt.js')();

    try
    {
        jsnbt.register('core', self.modules.core);
    }
    catch (err) {
        logger.error(err);
        throw err;
    }

    _.each(self.modules.rest, function (installedModule) {
        try {
            if (typeof (installedModule.init) === 'function') {
                logger.debug('initiating module: ' + installedModule.domain);
                installedModule.init(self);
            }

            jsnbt.register(installedModule.domain, installedModule);
        }
        catch (err) {
            logger.error(err);
            throw err;
        }
    });
    
    if (self.modules.public) {
        try {
            if (typeof (self.modules.public.init) === 'function') {
                logger.debug('initiating module: ' + self.modules.public.domain);
                self.modules.public.init(self);
            }

            jsnbt.register('public', self.modules.public);
        }
        catch (err) {
            logger.error(err);
            throw err;
        }
    }

    delete this.init;
}

exports.createServer = function (options) {
    var self = this;

    var defOpts = {
        env: 'dev',
        host: '',
        port: 0,
        db: {
            host: '',
            port: 27017,
            name: ''
        }
    };

    var opts = {};
    extend(true, opts, defOpts, options);

    this.environment = opts.env === 'prod' || opts.env === 'dist' ? Environment.Production : Environment.Development;
    this.directory = this.environment == Environment.Production ? Directory.Production : Directory.Development;
    
    extend(opts, {
        env: self.environment
    });

    process.chdir(this.directory);
    
    this.path = path.join(__dirname, this.directory, 'public');
    this.dbg = this.environment !== Environment.Production;
    
    var server = require('./server.js')(this, opts);

    return server;
};

exports.getBower = function () {
    return require('../web/bower.json');
};

exports.getConfig = function () {
    return require('../cfg/config.js');
};

exports.getVersion = function () {
    return require('../../package').version;
};