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

var getLists = function () {

    var lists = [];

    var templateSpecDir = '../' + app.root + '/public/tmpl/spec/list';

    if (fs.existsSync(templateSpecDir)) {
        var filesInternal = fs.readdirSync(templateSpecDir);
        filesInternal.forEach(function (file) {
            var fileSpecPath = templateSpecDir + '/' + file;
            var fileName = file.substr(0, file.lastIndexOf('.'));
            lists.push({
                id: fileName,
                domain: 'core',
                name: fileName,
                spec: fs.existsSync(fileSpecPath) ? '../tmpl/spec/list/' + file : undefined
            });
        });
    }

    return lists;
};

module.exports = {

    configurations: {},

    modules: [],
    
    addons: [],

    registerModule: function (name, module) {
        
        module.name = name;
        this.modules.push(module);

        if (module.addon) {
            this.addons.push({
                name: module.name,
                domain: module.domain,
                version: module.version
            });
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
            result.entities = [];
            result.lists = []; 

            _.each(self.modules, function (module) {
                var moduleEntities = module.entities || [];
                _.each(moduleEntities, function (moduleEntity) {
                    var newEntitySpec = {};
                    _.extend(newEntitySpec, moduleEntity);
                    result.entities.push(newEntitySpec);
                });

                var moduleLists = module.lists || [];
                _.each(moduleLists, function (moduleList) {
                    var fileName = moduleList.spec.substring(0, moduleList.spec.lastIndexOf('.'));
                    fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

                    var newListSpec = {
                        id: fileName,
                        domain: module.addon ? module.domain : 'core'
                    };
                    _.extend(newListSpec, moduleList);
                    result.lists.push(newListSpec);
                });
            });

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