var app = require('./app.js');
var path = require('path');
var server = require('server-root');
var fs = require('./utils/fs.js');
var _ = require('underscore');

_.str = require('underscore.string');

var getVersion = function () {
    var versionInfo = fs.existsSync(server.getPath('node_modules/jsnbt/package.json')) ? require(server.getPath('node_modules/jsnbt/package.json')) : require(server.getPath('package.json'));
    return versionInfo.version;
};

var getViews = function () {

    var views = [];

    var templateDir = '../' + app.root + '/public/tmpl/view';
    var templateSpecDir = '../' + app.root + '/public/tmpl/spec/view';

    if (fs.existsSync(templateDir)) {
        var filesInternal = fs.readdirSync(templateDir);
        filesInternal.forEach(function (file) {
            var fileSpecPath = templateSpecDir + '/' + file;
            views.push({
                tmpl: '/tmpl/view/' + file,
                spec: fs.existsSync(fileSpecPath) ? '../tmpl/spec/view/' + file : undefined
            });
        });
    }

    return views;
};

module.exports = {

    configurations: {},

    entities: [],

    lists: [],

    roles: [],

    sections: [],

    data: [],

    modules: [],
    
    addons: [],

    registerModule: function (name, module) {
        
        var self = this;

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
            _.extend(resultObj, obj);
            return resultObj
        }

        var moduleEntities = module.entities || [];
        _.each(moduleEntities, function (moduleEntity) {
            var matchedEntity = _.first(_.filter(self.entities, function (x) { return x.name === moduleEntity.name; }));
            if (matchedEntity) {
                _.extend(matchedEntity, moduleEntity);
            }
            else {
                self.entities.push(clone(moduleEntity));
            }            
        });

        var moduleLists = module.lists || [];
        _.each(moduleLists, function (moduleList) {
            var fileName = moduleList.spec.substring(0, moduleList.spec.lastIndexOf('.'));
            fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

            var moduleListDomain = moduleList.addon ? moduleList.domain : 'core';

            var matchedList = _.first(_.filter(self.lists, function (x) { return x.id === fileName && x.domain == moduleListDomain; }));
            if (matchedList) {
                _.extend(matchedList, moduleList);
            }
            else {
                var newListSpec = {
                    domain: moduleListDomain
                };

                _.extend(newListSpec, moduleList);
                newListSpec.id = fileName;

                self.lists.push(newListSpec);
            }
        });

        var moduleRoles = module.roles || [];
        _.each(moduleRoles, function (moduleRole) {
            var matchedRole = _.first(_.filter(self.roles, function (x) { return x.name === moduleRole.name; }));
            if (matchedRole) {
                _.extend(matchedRole, moduleRole);
            }
            else {
                self.roles.push(clone(moduleRole));
            }
        });

        var moduleSections = module.sections || [];
        _.each(moduleSections, function (moduleSection) {
            var matchedSection = _.first(_.filter(self.sections, function (x) { return x.name === moduleSection.name; }));
            if (matchedSection) {
                _.extend(matchedSection, moduleSection);
            }
            else {
                self.sections.push(clone(moduleSection));
            }
        });

        var moduleData = module.data || [];
        _.each(moduleData, function (moduleDatum) {
            var matchedDatum = _.first(_.filter(self.data, function (x) { return x.collection === moduleDatum.collection; }));
            if (matchedDatum) {
                _.extend(matchedDatum, moduleDatum);
            }
            else {
                self.data.push(clone(moduleDatum));
            }
        });
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

        result.modules = [];
        _.each(this.modules, function (mod) {
            if (mod.modules && mod.modules[site]) {
                if (typeof (mod.modules[site]) === 'string') {
                    result.modules.push(mod.modules[site]);
                }
                else {
                    _.each(mod.modules[site], function (mod2) {
                        result.modules.push(mod2);
                    });
                }
            }
        });

        if (site === 'admin') {

            result.version = getVersion();
            result.views = getViews();
            result.addons = self.addons;
            result.entities = self.entities;
            result.lists = self.lists; 
            result.roles = self.roles;
            result.sections = self.sections;
        }

        return result;
    },

    getLanguages: function () {
        return [
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
        ];
    }

};