var path = require('path');
var server = require('server-root');
var fs = require('fs');
var extend = require('extend');
var _ = require('underscore');

_.str = require('underscore.string');

var getVersion = function () {
    var versionInfo = fs.existsSync(server.getPath('node_modules/jsnbt/package.json')) ?
        require(server.getPath('node_modules/jsnbt/package.json')) :
        require(server.getPath('package.json'));

    return versionInfo.version;
};

var Jsnbt = function () {

    return {

        languages: require('./storage/languages.js'),

        countries: require('./storage/countries.js'),
        
        modules: [],

        configs: {},

        localization: true,

        locale: '',

        ssl: false,

        restricted: false,

        jsModules: [],

        scripts: [],

        fileGroups: [],

        images: [],

        entities: [],

        roles: [],

        sections: [],

        collections: {},

        lists: [],

        layouts: [],

        containers: [],

        templates: [],

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
        },

        register: function (name, module) {

            var self = this;

            var moduleConfig = typeof (module.getConfig) === 'function' ? module.getConfig() : {};

            var clone = function (obj) {
                var resultObj = {};
                extend(true, resultObj, obj);
                return resultObj;
            }
            
            var applyArray = function (configName, matchName) {
                if (_.isArray(moduleConfig[configName])) {
                    _.each(moduleConfig[configName], function (moduleItem) {
                        var matchedItem = _.first(_.filter(self[configName], function (x) { return x[matchName] === moduleItem[matchName]; }));
                        if (matchedItem) {
                            extend(true, matchedItem, moduleItem);
                        }
                        else {
                            self[configName] = self[configName] || [];
                            self[configName].push(clone(moduleItem));
                        }
                    });
                }
            };

            var applyArrayInObject = function (configName, matchName) {
                if (_.isArray(moduleConfig[configName])) {
                    _.each(moduleConfig[configName], function (moduleItem) {

                        if (self[configName][matchName]) {
                            extend(true, self[configName][moduleItem.name], moduleItem);
                        }
                        else {
                            self[configName][moduleItem.name] = clone(moduleItem);
                        }
                    });
                }
            };

            var applyTextArray = function (configName) {
                if (_.isArray(moduleConfig[configName])) {
                    _.each(moduleConfig[configName], function (moduleItem) {
                        self[configName] = self[configName] || [];
                        if (self[configName].indexOf(moduleItem) === -1)
                            self[configName].push(moduleItem);
                    });
                }
            };

            var applyObject = function (configName) {
                if (_.isObject(moduleConfig[configName])) {
                    var newObj = {};
                    extend(true, newObj, moduleConfig[configName]);
                    self[configName] = newObj;
                }
            };

            var entityDefaults = {
                name: '',
                allowed: [],
                treeNode: true,
                localized: true,

                properties: {
                    name: true,
                    parent: true,
                    template: true,
                    layout: true,
                    seo: true,
                    meta: true,
                    permissions: true,
                    robots: true,
                    ssl: true
                }
            };
            
            if (moduleConfig.jsModule) {
                if (_.isString(moduleConfig.jsModule)) {
                    if (self.jsModules.indexOf(moduleConfig.jsModule) === -1)
                        self.jsModules.push(moduleConfig.jsModule);
                }
                else if (_.isArray(moduleConfig.jsModule)) {
                    _.each(moduleConfig.jsModule, function (mod2) {
                        if (self.jsModules.indexOf(mod2) === -1)
                            self.jsModules.push(mod2);
                    });
                }
            }

            applyTextArray('scripts');

            if (_.isArray(moduleConfig.entities)) {
                _.each(moduleConfig.entities, function (moduleEntity) {
                    var matchedEntity = _.first(_.filter(self.entities, function (x) { return x.name === moduleEntity.name; }));
                    if (matchedEntity) {
                        extend(true, matchedEntity, moduleEntity);
                    }
                    else {
                        var newEntity = {};
                        extend(true, newEntity, entityDefaults, moduleEntity);
                        self.entities.push(newEntity);
                    }
                });
            }

            applyArray('roles', 'name');

            applyArray('sections', 'name');

            applyArrayInObject('collections', 'name');
            
            applyArray('images', 'name');

            applyTextArray('fileGroups');

            if (_.isArray(moduleConfig.lists)) {
                _.each(moduleConfig.lists, function (moduleList) {
                    var fileName = moduleList.form.substring(0, moduleList.form.lastIndexOf('.'));
                    fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

                    if (module.domain) {
                        var moduleListDomain = module.public ? 'public' : module.domain;

                        var matchedList = _.first(_.filter(self.lists, function (x) { return x.id === fileName && x.domain == moduleListDomain; }));
                        if (matchedList) {
                            extend(true, matchedList, moduleList);
                        }
                        else {
                            var newListSpec = {
                                domain: moduleListDomain,
                                localized: true
                            };

                            extend(true, newListSpec, moduleList);

                            if (!newListSpec.id)
                                newListSpec.id = fileName;

                            self.lists.push(newListSpec);
                        }
                    }
                });
            }

            
            if (moduleConfig.messaging && moduleConfig.messaging.mail) {
                if (moduleConfig.messaging.mail.provider && typeof (moduleConfig.messaging.mail.getSender) === 'function') {
                    self.messaging.mail.implementations[module.domain] = {
                        provider: moduleConfig.messaging.mail.provider,
                        settingsTmpl: moduleConfig.messaging.mail.settingsTmpl,
                        getSender: moduleConfig.messaging.mail.getSender
                    };
                }
            }

            if (moduleConfig.messaging && moduleConfig.messaging.sms) {
                if (moduleConfig.messaging.sms.provider && typeof (moduleConfig.messaging.sms.getSender) === 'function') {
                    self.messaging.sms.implementations[module.domain] = {
                        provider: moduleConfig.messaging.sms.provider,
                        settingsTmpl: moduleConfig.messaging.sms.settingsTmpl,
                        getSender: moduleConfig.messaging.sms.getSender
                    };
                }
            }

            if (module.public) {

                if (moduleConfig.ssl !== undefined) {
                    self.ssl = moduleConfig.ssl === true;
                }

                if (moduleConfig.locale !== undefined) {
                    var language = _.first(_.filter(this.languages, function (x) { return x.code === moduleConfig.locale; }));
                    if (language) {
                        self.localization = false;
                        self.locale = language.code;
                    }
                }

                if (moduleConfig.restricted !== undefined) {
                    self.restricted = moduleConfig.restricted;
                }

                applyArray('templates', 'id');

                applyObject('injects');

                applyArray('layouts', 'id');

                applyArray('containers', 'id');

                applyArray('routes', 'id');

                if (module.messager) {
                    if (moduleConfig.messaging && moduleConfig.messaging.mail && moduleConfig.messaging.mail.templates && _.isArray(moduleConfig.messaging.mail.templates)) {
                        _.each(moduleConfig.messaging.mail.templates, function (template) {
                            self.messaging.mail.templates[template.code] = template;
                        });
                    }

                    if (moduleConfig.messaging && moduleConfig.messaging.sms && moduleConfig.messaging.sms.templates && _.isArray(moduleConfig.messaging.sms.templates)) {
                        _.each(moduleConfig.messaging.sms.templates, function (template) {
                            self.messaging.sms.templates[template.code] = template;
                        });
                    }
                }
            }
            
            moduleConfig.public = module.public;
            moduleConfig.domain = module.domain;
            moduleConfig.version = module.version;
            moduleConfig.browsable = module.browsable;
            moduleConfig.name = name;
            this.modules.push(moduleConfig);

            if (typeof (moduleConfig.register) === 'function') {
                self.configs[moduleConfig.domain] = moduleConfig.register();
            }

            var newModules = [];
            var coreModule = _.find(this.modules, function (x) { return x.domain === 'core'; });
            if (coreModule)
                newModules.push(coreModule);

            var restModules = _.filter(this.modules, function (x) { return x.domain !== 'core' && !x.public; });
            _.each(restModules, function (mod) {
                newModules.push(mod);
            });

            var publicModule = _.find(this.modules, function (x) { return x.public === true; });
            if (publicModule)
                newModules.push(publicModule);

            this.modules = newModules;
        },

        get: function () {
            var self = this;

            var applyArrayInObject = function (selfName, resultName, identifier) {
                result[resultName] = {};
                _.each(self[selfName], function (selfItem) {
                    result[resultName][selfItem[identifier]] = selfItem;
                });
            };

            var result = {};

            result.localization = {
                enabled: self.localization,
                locale: self.locale
            };
            
            result.jsModules = self.jsModules;

            result.version = getVersion();
            result.restricted = self.restricted;
            result.ssl = self.ssl;

            result.fileGroups = self.fileGroups;

            result.modules = {};
            _.each(self.modules, function (module) {

                if (module.domain !== 'core') {
                    result.modules[module.domain] = {
                        name: module.name,
                        domain: module.domain,
                        type: module.type,
                        version: module.version,
                        pointed: module.pointed,
                        section: module.section,
                        browsable: module.browsable === undefined || module.browsable === true
                    }

                    if (self.configs[module.domain]) {
                        extend(true, result.modules[module.domain], self.configs[module.domain]);
                    }
                }
            });

            result.lists = [];
            _.each(self.lists, function (list) {
                var newList = {};
                extend(true, newList, list);
                delete newList.permissions;
                result.lists.push(newList);
            });

            result.injects = [];
            _.each(self.modules, function (module) {
                if (module.injects) {
                    var newInjects = {};
                    extend(true, newInjects, module.injects);
                    newInjects.domain = module.domain;
                    result.injects.push(newInjects);
                }
            });

            applyArrayInObject('entities', 'entities', 'name');

            applyArrayInObject('roles', 'roles', 'name');

            applyArrayInObject('sections', 'sections', 'name');            

            applyArrayInObject('templates', 'templates', 'id');

            applyArrayInObject('layouts', 'layouts', 'id');

            applyArrayInObject('containers', 'containers', 'id');

            applyArrayInObject('routes', 'routes', 'id');

            applyArrayInObject('languages', 'languages', 'code');

            applyArrayInObject('countries', 'countries', 'code');

            result.messaging = {
                mail: {},
                sms: {}
            };

            for (var mailImplementationName in self.messaging.mail.implementations)
            {
                var mailImplementation = self.messaging.mail.implementations[mailImplementationName];
                result.messaging.mail[mailImplementationName] = {
                    domain: mailImplementationName,
                    name: mailImplementation.provider,
                    settingsTmpl: mailImplementation.settingsTmpl
                }
            }

            for (var smsImplementationName in self.messaging.sms.implementations) {
                var smsImplementation = self.messaging.sms.implementations[smsImplementationName];
                result.messaging.sms[smsImplementationName] = {
                    domain: smsImplementationName,
                    name: smsImplementation.provider,
                    settingsTmpl: smsImplementation.settingsTmpl
                }
            }

            return result;
        }
    };

}

module.exports = Jsnbt;