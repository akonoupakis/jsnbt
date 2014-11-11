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
    
    languages: [
        { name: 'Greek', code: 'el' },
        { name: 'English', code: 'en' },
        { name: 'Deutsch', code: 'de' },
        { name: 'Spanish', code: 'es' },
        { name: 'French', code: 'fr' },
        { name: 'Italian', code: 'it' },
        { name: 'Russian', code: 'ru' },
        { name: 'Chinese', code: 'zh' },
        { name: 'Romanian', code: 'ro' },
        { name: 'Bulgarian', code: 'bg' }
    ],

    countries: [
        { name: 'Greece', code: 'GR' },
        { name: 'United Kingdom', code: 'GB' }
    ],

    localization: true,

    locale: '',

    restricted: true,

    scripts: [],

    configurations: {},

    modules: [],

    addons: [],

    entities: [],
    
    roles: [],

    sections: [],

    data: [],
    
    images: [],
    
    injects: {},

    templates: [],

    lists: [],
            
    registerModule: function (name, module) {
        
        var self = this;

        if (module.public) {
            if (module.locale !== undefined) {
                var language = _.first(_.filter(this.languages, function (x) { return x.code === module.locale; }));
                if (language) {
                    self.localization = false;
                    self.locale = language.code;
                }
            }

            if (module.restricted !== undefined) {
                self.restricted = module.restricted;
            }
        }

        module.name = name;
        this.modules.push(module);

        if (module.addon) {
            this.addons.push({
                name: module.name,
                domain: module.domain,
                version: module.version
            });
        };

        var clone = function (obj) {
            var resultObj = {};
            extend(true, resultObj, obj);
            return resultObj
        }

        var moduleScripts = module.scripts || [];
        _.each(moduleScripts, function (moduleScript) {
            if (self.scripts.indexOf(moduleScript) === -1)
                self.scripts.push(moduleScript);
        });

        var entityDefaults = {
            name: '',
            allowed: [],
            treeNode: true,
            localized: true,

            properties: {
                name: true,
                parent: true,
                template: true,
                seo: true,
                meta: true,
                permissions: true,
                robots: true
            }
        };

        var moduleEntities = module.entities || [];
        _.each(moduleEntities, function (moduleEntity) {
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

        if (module.domain !== 'core' || (module.domain === 'core' && module.public)) {
            var moduleLists = module.lists || [];
            _.each(moduleLists, function (moduleList) {
                var fileName = moduleList.spec.substring(0, moduleList.spec.lastIndexOf('.'));
                fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

                var moduleListDomain = module.addon ? module.domain : 'core';

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
                    newListSpec.id = fileName;

                    self.lists.push(newListSpec);
                }
            });
        }

        var moduleRoles = module.roles || [];
        _.each(moduleRoles, function (moduleRole) {
            var matchedRole = _.first(_.filter(self.roles, function (x) { return x.name === moduleRole.name; }));
            if (matchedRole) {
                extend(true, matchedRole, moduleRole);
            }
            else {
                self.roles.push(clone(moduleRole));
            }
        });

        var moduleSections = module.sections || [];
        _.each(moduleSections, function (moduleSection) {
            var matchedSection = _.first(_.filter(self.sections, function (x) { return x.name === moduleSection.name; }));
            if (matchedSection) {
                extend(true, matchedSection, moduleSection);
            }
            else {
                self.sections.push(clone(moduleSection));
            }
        });

        var moduleData = module.data || [];
        _.each(moduleData, function (moduleDatum) {
            var matchedDatum = _.first(_.filter(self.data, function (x) { return x.collection === moduleDatum.collection; }));
            if (matchedDatum) {
                extend(true, matchedDatum, moduleDatum);
            }
            else {
                self.data.push(clone(moduleDatum));
            }
        });
        
        var moduleImages = module.images || [];
        _.each(moduleImages, function (moduleImage) {
            var matchedImage = _.first(_.filter(self.images, function (x) { return x.name === moduleImage.name; }));
            if (matchedImage) {
                extend(true, matchedImage, moduleImage);
            }
            else {
                self.images.push(clone(moduleImage));
            }
        });

        if (module.public) {
            var moduleTemplates = module.templates || [];
            _.each(moduleTemplates, function (moduleTemplate) {
                var matchedTemplate = _.first(_.filter(self.templates, function (x) { return x.path === moduleTemplate.path; }));
                if (matchedTemplate) {
                    extend(true, matchedTemplate, moduleTemplate);
                }
                else {
                    self.templates.push(clone(moduleTemplate));
                }
            });

            if (module.injects) {
                var injects = {};

                extend(true, injects, {
                    navigation: [],
                    dashboard: undefined,
                    content: undefined,
                    settings: undefined
                }, module.injects);

                self.injects = injects;
            }
        }
    },

    registerConfig: function (name, config) {
        config.name = name;
        this.configurations[name] = config;
    },
    
    getConfiguration: function (name) {
        return this.configurations[name] || {};
    },

    getConfigurations: function () {
        var results = [];

        for (var configName in this.configurations)
            results.push(this.configurations[configName]);

        return results;
    },

    getClientData: function (site) {
        var self = this;

        var result = {};

        result.localization = {
            enabled: self.localization,
            locale: self.locale
        };

        if (site === 'admin') {

            result.modules = [];
            _.each(this.modules, function (mod) {
                if (mod.modules && mod.modules) {
                    if (typeof (mod.modules) === 'string') {
                        result.modules.push(mod.modules);
                    }
                    else {
                        _.each(mod.modules, function (mod2) {
                            result.modules.push(mod2);
                        });
                    }
                }
            });

            result.version = getVersion();
            result.restricted = self.restricted;

            result.addons = self.addons;

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
        }

        result.languages = self.languages;
        result.countries = self.countries;

        return result;
    }

};