var app = require('./app.js');
var path = require('path');
var server = require('server-root');
var fs = require('./utils/fs.js');
var extend = require('extend');
var _ = require('underscore');

_.str = require('underscore.string');

var getVersion = function () {
    var versionInfo = fs.existsSync(server.getPath('node_modules/jsnbt/package.json')) ? require(server.getPath('node_modules/jsnbt/package.json')) : require(server.getPath('package.json'));
    return versionInfo.version;
};

module.exports = {
    
    languages: require('./store/languages.js'),

    countries: require('./store/countries.js'),

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

    injects: {},

    layouts: [],

    containers: [],

    templates: [],

    lists: [],
            
    register: function (name, module) {
        
        var self = this;

        var moduleConfig = typeof (module.getConfig) === 'function' ? module.getConfig() : {};
        this.setConfig(name, moduleConfig);
        
        moduleConfig.name = name;
        this.modules.push(moduleConfig);
        
        var clone = function (obj) {
            var resultObj = {};
            extend(true, resultObj, obj);
            return resultObj
        }

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

        if (_.isArray(moduleConfig.scripts)) {
            _.each(moduleConfig.scripts, function (moduleScript) {
                if (self.scripts.indexOf(moduleScript) === -1)
                    self.scripts.push(moduleScript);
            });
        }

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

        if (_.isArray(moduleConfig.roles)) {
            _.each(moduleConfig.roles, function (moduleRole) {
                var matchedRole = _.first(_.filter(self.roles, function (x) { return x.name === moduleRole.name; }));
                if (matchedRole) {
                    extend(true, matchedRole, moduleRole);
                }
                else {
                    self.roles.push(clone(moduleRole));
                }
            });
        }

        if (_.isArray(moduleConfig.sections)) {
            _.each(moduleConfig.sections, function (moduleSection) {
                var matchedSection = _.first(_.filter(self.sections, function (x) { return x.name === moduleSection.name; }));
                if (matchedSection) {
                    extend(true, matchedSection, moduleSection);
                }
                else {
                    self.sections.push(clone(moduleSection));
                }
            });
        }

        if (_.isArray(moduleConfig.permissions)) {
            _.each(moduleConfig.permissions, function (modulePermission) {
                var matchedPermission = _.first(_.filter(self.permissions, function (x) { return x.collection === modulePermission.collection; }));
                if (matchedPermission) {
                    extend(true, matchedPermission, modulePermission);
                }
                else {
                    self.permissions.push(clone(modulePermission));
                }
            });
        }

        if (_.isArray(moduleConfig.images)) {
            _.each(moduleConfig.images, function (moduleImage) {
                var matchedImage = _.first(_.filter(self.images, function (x) { return x.name === moduleImage.name; }));
                if (matchedImage) {
                    extend(true, matchedImage, moduleImage);
                }
                else {
                    self.images.push(clone(moduleImage));
                }
            });
        }

        if (_.isArray(moduleConfig.fileGroups)) {
            _.each(moduleConfig.fileGroups, function (fileGroup) {
                if (self.fileGroups.indexOf(fileGroup) === -1)
                    self.fileGroups.push(fileGroup);
            });
        }

        if (moduleConfig.domain !== 'core' || (moduleConfig.domain === 'core' && moduleConfig.public)) {
            
            if (_.isArray(moduleConfig.lists)) {
                _.each(moduleConfig.lists, function (moduleList) {
                    var fileName = moduleList.form.substring(0, moduleList.form.lastIndexOf('.'));
                    fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

                    var moduleListDomain = moduleConfig.type === 'addon' ? moduleConfig.domain : 'core';

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
                });
            }

            if (moduleConfig.public) {

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

                if (_.isArray(moduleConfig.templates)) {
                    _.each(moduleConfig.templates, function (moduleTemplate) {
                        var matchedTemplate = _.first(_.filter(self.templates, function (x) { return x.id === moduleTemplate.id; }));
                        if (matchedTemplate) {
                            extend(true, matchedTemplate, moduleTemplate);
                        }
                        else {
                            self.templates.push(clone(moduleTemplate));
                        }
                    });
                }

                if (_.isObject(moduleConfig.injects)) {
                    var injects = {};

                    extend(true, injects, {
                        navigation: [],
                        dashboard: undefined,
                        content: undefined,
                        settings: undefined
                    }, moduleConfig.injects);

                    self.injects = injects;
                }

                if (_.isArray(moduleConfig.layouts)) {
                    _.each(moduleConfig.layouts, function (moduleLayout) {
                        var matchedLayout = _.first(_.filter(self.layouts, function (x) { return x.id === moduleLayout.id; }));
                        if (matchedLayout) {
                            extend(true, matchedLayout, moduleLayout);
                        }
                        else {
                            self.layouts.push(clone(moduleLayout));
                        }
                    });
                }

                if (_.isArray(moduleConfig.containers)) {
                    _.each(moduleConfig.containers, function (moduleContainer) {
                        var matchedContainer = _.first(_.filter(self.containers, function (x) { return x.id === moduleContainer.id; }));
                        if (matchedContainer) {
                            extend(true, matchedContainer, moduleContainer);
                        }
                        else {
                            self.containers.push(clone(moduleContainer));
                        }
                    });
                }

            }
        }
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
        }

        result.languages = self.languages;
        result.countries = self.countries;

        return result;
    }

};