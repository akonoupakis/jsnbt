var app = require('./app.js');
var path = require('path');
var fs = require('./utils/fs.js');
var _ = require('underscore');

_.str = require('underscore.string');

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

    modules: {
        public: [],
        admin: []
    },

    configurations: {},

    addons: {},

    registerModule: function (site, module) {
        if (typeof (module) === 'string') {
            if (this.modules[site].indexOf(module) == -1)
                this.modules[site].push(module);
        }
        else {
            for (var i = 0; i < module.length; i++) {
                if (this.modules[site].indexOf(module[i]) == -1)
                    this.modules[site].push(module[i]);
            }
        }
    },

    registerConfig: function (name, config) {
        config.name = name;
        this.configurations[name] = config;
    },

    registerAddon: function (name, addon) {
        addon.name = name;
        this.addons[name] = addon;
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

    getAddon: function (name) {
        return this.addons[name] || {};
    },

    getAddons: function () {
        var results = [];

        for (var addonName in this.addons)
            results.push(this.addons[addonName]);
        
        return results;
    },
    
    getClientData: function (site) {
        var result = {};

        result.modules = this.modules[site];

        if (site === 'admin') {

            result.views = getViews();
            result.addons = [];
            result.entities = [];
            result.lists = getLists();

            var registered = this.getAddons();
            
            result.entities.push({
                name: 'page',
                allowed: ['page', 'pointer', 'link']
            });

            result.entities.push({
                name: 'pointer',
                allowed: []
            });

            result.entities.push({
                name: 'link',
                allowed: []
            });

            for (var addonName in registered) {

                var clonedAddon = {};
                _.extend(clonedAddon, registered[addonName]);
                
                var addonEntities = clonedAddon.entities || [];
                for (var i = 0; i < addonEntities.length; i++) {
                    var newEntitySpec = {};
                    _.extend(newEntitySpec, addonEntities[i]);
                    result.entities.push(newEntitySpec);
                }

                var addonLists = clonedAddon.lists || [];
                for (var ii = 0; ii < addonLists.length; ii++) {
                    var fileName = addonLists[ii].spec.substr(0, addonLists[ii].spec.lastIndexOf('.'));
                    fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

                    var newListSpec = {
                        id: fileName,
                        domain: clonedAddon.domain
                    };
                    _.extend(newListSpec, addonLists[ii]);
                    result.lists.push(newListSpec);
                }

                delete clonedAddon.entities;
                delete clonedAddon.lists;

                result.addons.push(clonedAddon);
            }
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