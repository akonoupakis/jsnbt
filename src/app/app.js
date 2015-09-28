var fs = require('fs');
var path = require('path');
var extend = require('extend');
var root = require('server-root');
var validation = require('json-validation');
var _ = require('underscore');

var Environment = {
    Development: 'dev',
    Production: 'prod'
};

var logger = require('./logger.js')(this);

var configSchema = require('../cfg/schema.json');

var languages = require('./data/store/languages.js');
var countries = require('./data/store/countries.js');

exports.domain = 'core';
exports.browsable = false;
exports.messager = true;

exports.environment = Environment.Development;

exports.path = null;

exports.dbg = false;

exports.title = 'jsnbt';

exports.localization = {
    enabled: true,
    locale: 'en'
};

exports.ssl = false;

exports.modules = {
    core: undefined,
    rest: [],
    public: undefined,
    all: []
};

exports.config = {
    
    fileGroups: [],

    images: [],

    entities: [],

    roles: [],

    sections: [],

    collections: {},

    lists: [],

    injects: [],

    layouts: [],

    containers: [],

    scripts: { },

    styles: { },

    templates: [],

    content: [],

    routes: [],

    messaging: {
        mail: {
            implementations: {},
            templates: {}
        },
        sms: {
            implementations: {},
            templates: {}
        }
    }

};

var versionInfo = fs.existsSync(root.getPath('node_modules/jsnbt/package.json')) ?
    require(root.getPath('node_modules/jsnbt/package.json')) :
    require(root.getPath('package.json'));

exports.version = versionInfo.version;

exports.languages = require('./data/store/languages.js');
exports.countries = require('./data/store/countries.js');

exports.root = root;

exports.register = function (module) {

    var self = this;

    if (!module.domain)
        return;

    logger.debug('registering module: ' + module.domain);

    var moduleConfig = typeof (module.getConfig) === 'function' ? module.getConfig() : {};

    var validator = new validation.JSONValidation();
    var validationResult = validator.validate(moduleConfig, configSchema);
    if (!validationResult.ok) {
        var validationErrors = validationResult.path + ': ' + validationResult.errors.join(' - ');
        throw new Error('validation error on ' + module.domain + ' module config file\n' + validationErrors);
    }

    var clone = function (obj, defaults) {
        var resultObj = {};
        defaults = defaults || {};
        extend(true, resultObj, defaults, obj);
        return resultObj;
    }
    
    var applyArray = function (configName, matchName) {
        if (_.isArray(moduleConfig[configName])) {
            _.each(moduleConfig[configName], function (moduleItem) {
                var matchedItem = _.find(self.config[configName], function (x) { return x[matchName] === moduleItem[matchName]; });
                if (matchedItem) {
                    extend(true, matchedItem, moduleItem);
                }
                else {
                    self.config[configName] = self.config[configName] || [];
                    self.config[configName].push(clone(moduleItem));
                }
            });
        }
    };

    var applyArrayInObject = function (configName, matchName, defaults) {
        if (_.isArray(moduleConfig[configName])) {
            _.each(moduleConfig[configName], function (moduleItem) {

                if (self.config[configName][moduleItem[matchName]]) {
                    extend(true, self.config[configName][moduleItem[matchName]], moduleItem);
                }
                else {
                    self.config[configName][moduleItem[matchName]] = clone(moduleItem, defaults);
                }
            });
        }
    };

    var applyTextArray = function (configName) {
        if (_.isArray(moduleConfig[configName])) {
            _.each(moduleConfig[configName], function (moduleItem) {
                self.config[configName] = self.config[configName] || [];
                if (self.config[configName].indexOf(moduleItem) === -1)
                    self.config[configName].push(moduleItem);
            });
        }
    };

    var applyObject = function (configName) {
        if (_.isObject(moduleConfig[configName])) {
            var newObj = {};
            extend(true, newObj, moduleConfig[configName]);
            self.config[configName] = newObj;
        }
    };
    

    if (_.isArray(moduleConfig.scripts)) {
        _.each(moduleConfig.scripts, function (moduleItem) {

            if (self.config.scripts[moduleItem.name]) {
                self.config.scripts[moduleItem.name].items = _.unique(_.union(self.config.scripts[moduleItem.name].items, moduleItem.items))
            }
            else {
                self.config.scripts[moduleItem.name] = clone(moduleItem, {});
            }
        });
    }

    if (_.isArray(moduleConfig.styles)) {
        _.each(moduleConfig.styles, function (moduleItem) {

            if (self.config.styles[moduleItem.name]) {
                self.config.styles[moduleItem.name].items = _.unique(_.union(self.config.styles[moduleItem.name].items, moduleItem.items))
            }
            else {
                self.config.styles[moduleItem.name] = clone(moduleItem, {});
            }
        });
    }
    
    var entityDefaults = {
        name: '',
        allowed: [],
        treeNode: true,
        localized: true,

        properties: {
            title: true,
            parent: true,
            template: true,
            active: true,
            layout: true,
            seo: true,
            meta: true,
            permissions: true,
            robots: true,
            ssl: true
        }
    };

    if (moduleConfig.entities) {
        _.each(moduleConfig.entities, function (moduleEntity) {
            var matchedEntity = _.find(self.config.entities, function (x) { return x.name === moduleEntity.name; });
            if (matchedEntity) {
                extend(true, matchedEntity, moduleEntity);
                matchedEntity.domain = module.domain;
            }
            else {
                var newEntity = {};
                extend(true, newEntity, entityDefaults, moduleEntity);
                newEntity.domain = module.domain;
                self.config.entities.push(newEntity);
            }
        });
    }

    applyArray('roles', 'name');

    applyArray('sections', 'name');

    applyArrayInObject('collections', 'name');

    applyArray('images', 'name');

    applyTextArray('fileGroups');

    applyArray('content', 'id');

    if (moduleConfig.lists) {
        _.each(moduleConfig.lists, function (moduleList) {
            var matchedList = _.find(self.config.lists, function (x) { return x.id === moduleConfig.id && x.domain == module.domain; });
            if (!matchedList) {
                matchedList = _.find(self.config.lists, function (x) { return x.id === moduleConfig.id; });
                if (matchedList)
                    throw new Error('list ' + matchedList.id + ' already registered for domain ' + module.domain);
            }

            if (matchedList) {
                extend(true, matchedList, moduleList);
            }
            else {
                var newListSpec = {
                    domain: module.domain,
                    localized: true
                };

                extend(true, newListSpec, moduleList);
                                
                self.config.lists.push(newListSpec);
            }
        });
    }
    
    if (_.isObject(moduleConfig.injects)) {
        var matchedItem = _.find(self.config.injects, function (x) { return x.domain === module.domain; });
        if (matchedItem) {
            extend(true, matchedItem, moduleConfig.injects);
        }
        else {
            self.config.injects = self.config.injects || [];
            var inject = clone(moduleConfig.injects);
            inject.domain = module.domain;
            self.config.injects.push(inject);
        }
    }

    if (moduleConfig.messaging && moduleConfig.messaging.mail) {
        if (moduleConfig.messaging.mail.provider && typeof (moduleConfig.messaging.mail.getSender) === 'function') {
            self.config.messaging.mail.implementations[module.domain] = {
                provider: moduleConfig.messaging.mail.provider,
                settingsTmpl: moduleConfig.messaging.mail.settingsTmpl,
                getSender: moduleConfig.messaging.mail.getSender
            };
        }
    }

    if (moduleConfig.messaging && moduleConfig.messaging.sms) {
        if (moduleConfig.messaging.sms.provider && typeof (moduleConfig.messaging.sms.getSender) === 'function') {
            self.config.messaging.sms.implementations[module.domain] = {
                provider: moduleConfig.messaging.sms.provider,
                settingsTmpl: moduleConfig.messaging.sms.settingsTmpl,
                getSender: moduleConfig.messaging.sms.getSender
            };
        }
    }

    if (module.domain !== 'core') {
        if (typeof (moduleConfig.register) === 'function') {
            module.config = moduleConfig.register();
        }
        else {
            module.config = {};
        }
    }
    
    if (module.domain === 'public' || module.domain === 'core') {
        applyArray('templates', 'id');
    }

    if (module.domain === 'public') {
        module.browsable = false;

        if (moduleConfig.ssl !== undefined) {
            self.ssl = moduleConfig.ssl === true;
        }

        if (moduleConfig.locale !== undefined) {
            var language = _.find(this.languages, function (x) { return x.code === moduleConfig.locale; });
            if (language) {
                self.localization.enabled = false;
                self.localization.locale = language.code;
            }
        }

        applyArray('layouts', 'id');

        applyArray('containers', 'id');

        applyArray('routes', 'id');

        if (module.messager) {
            if (moduleConfig.messaging && moduleConfig.messaging.mail && moduleConfig.messaging.mail.templates && _.isArray(moduleConfig.messaging.mail.templates)) {
                _.each(moduleConfig.messaging.mail.templates, function (template) {
                    self.config.messaging.mail.templates[template.code] = template;
                });
            }

            if (moduleConfig.messaging && moduleConfig.messaging.sms && moduleConfig.messaging.sms.templates && _.isArray(moduleConfig.messaging.sms.templates)) {
                _.each(moduleConfig.messaging.sms.templates, function (template) {
                    self.config.messaging.sms.templates[template.code] = template;
                });
            }
        }
    }

    if (module.domain === 'core') {
        self.modules.core = module;
    }
    else if (module.domain === 'public') {
        self.modules.public = module;
    }
    else {
        self.modules.rest.push(module);
    }

    self.modules.all.push(module);
};

exports.init = function (options) {
    var self = this;
    
    var defOpts = {
        title: self.title
    };

    var opts = {};
    extend(true, opts, defOpts, options);

    this.title = opts.title;
        
    if (!fs.existsSync(root.getPath('www')))
       throw new Error('deployment directory not found! run grunt!');

    var coreModule = {
        domain: 'core',
        browsable: false,
        messager: true,
        getName: self.getName,
        getVersion: self.getVersion,
        getConfig: self.getConfig,
        getBower: self.getBower
    };
    
    this.register(coreModule);
    
    var installedModulePaths = fs.readFileSync(root.getPath('www/modules'), 'utf8').split('\n');
    
    _.each(installedModulePaths, function (installedModulePath) {
    
        var installedModule = require(root.getPath(installedModulePath));
        if (installedModule.domain && installedModule.domain !== 'core') {            
            self.register(installedModule);
        }
    });

    logger.debug('initiating module: core');

    _.each(self.modules.rest, function (installedModule) {
        try {
            if (typeof (installedModule.init) === 'function') {
                logger.debug('initiating module: ' + installedModule.domain);
                installedModule.init(self);
            }
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
        }
        catch (err) {
            logger.error(err);
            throw err;
        }
    }

    delete this.init;
}

exports.createServer = function (options) {
    if (!fs.existsSync(root.getPath('www')))
        throw new Error('deployment directory not found! run grunt!');

    var mode = fs.readFileSync('www/mode', {
        encoding: 'utf8'
    }); 

    this.dbg = mode !== 'prod';
    this.environment = mode === 'prod' ? Environment.Production : Environment.Development;

    var defOpts = {
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
    
    process.chdir('www');
    
    this.path = path.join(__dirname, 'www', 'public');
    
    var server = require('./server.js')(this, opts);
    return server;
};

exports.getName = function () {
    return require('../../package').name;
};

exports.getVersion = function () {
    return require('../../package').version;
};

exports.getConfig = function () {
    return require('../cfg/config.js');
};

exports.getBower = function () {
    return require('../web/bower.json');
};