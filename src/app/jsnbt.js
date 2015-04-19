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

        configs: {},

        modules: [],

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

        permissions: [],

        lists: [],

        injects: {
            navigation: [],
            dashboard: undefined,
            content: undefined,
            settings: undefined
        },

        layouts: [],

        containers: [],

        templates: [],

        routes: [],

        register: function (name, module) {

            var self = this;

            var moduleConfig = typeof (module.getConfig) === 'function' ? module.getConfig() : {};

            var clone = function (obj) {
                var resultObj = {};
                extend(true, resultObj, obj);
                return resultObj
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

            applyArray('permissions', 'collection');

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
            }

            this.setConfig(name, moduleConfig);

            moduleConfig.public = module.public;
            moduleConfig.domain = module.domain;
            moduleConfig.version = module.version;
            moduleConfig.browsable = module.browsable;
            moduleConfig.name = name;
            this.modules.push(moduleConfig);
        },

        setConfig: function (name, config) {
            config.name = name;
            this.configs[name] = config;
        },

        getConfig: function (name) {
            return this.configs[name] || {};
        },

        getClientData: function (site) {
            var self = this;

            var result = {};

            result.localization = {
                enabled: self.localization,
                locale: self.locale
            };

            if (site === 'admin') {

                result.jsModules = self.jsModules;

                result.version = getVersion();
                result.restricted = self.restricted;
                result.ssl = self.ssl;

                result.fileGroups = self.fileGroups;

                var modules = [];
                _.each(self.modules, function (module) {

                    if (!module.public && (module.browsable === undefined || module.browsable === true)) {
                        modules.push({
                            name: module.name,
                            domain: module.domain,
                            type: module.type,
                            version: module.version,
                            pointed: module.pointed,
                            section: module.section
                        });
                    }
                });
                result.modules = modules;

                result.entities = self.entities;

                result.roles = self.roles;
                result.sections = self.sections;

                result.lists = [];
                _.each(self.lists, function (list) {
                    var newList = {};
                    extend(true, newList, list);
                    delete newList.permissions;
                    result.lists.push(newList);
                });

                result.templates = self.templates;
                result.injects = self.injects;
                result.layouts = self.layouts;
                result.containers = self.containers;
                result.routes = self.routes;
            }

            result.languages = self.languages;
            result.countries = self.countries;

            return result;
        }

    };

}

module.exports = Jsnbt;