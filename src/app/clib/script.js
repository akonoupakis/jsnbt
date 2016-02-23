var fs = require('fs-extra');
var path = require('path');
var extend = require('extend');
var _ = require('underscore');

_.str = require('underscore.string');

var Script = function (app) {

    var languages = require('../data/languages.js');
    var countries = require('../data/countries.js');

    var getResources = function () {

        var resources = [];

        Object.keys(app.config.collections).forEach(function (collectionName) {
            var resource = app.config.collections[collectionName];
            resources.push(resource);
        });

        return resources;
    };

    var getJsnbtObject = function () {

        var result = {
            name: app.config.name,
            version: app.version,
            localization: app.localization,
            ssl: app.ssl
        };

        var applyArrayInObject = function (selfName, resultName, identifier) {
            result[resultName] = {};
            _.each(app.config[selfName], function (selfItem) {
                result[resultName][selfItem[identifier]] = selfItem;
            });
        };

        result.fileGroups = app.config.fileGroups;

        result.modules = {};
        _.each(app.modules.all, function (module) {
            
            if (module.domain !== 'core') {
                result.modules[module.domain] = {
                    name: typeof (module.getName) === 'function' ? module.getName() : undefined,
                    
                    domain: module.domain,
                    version: typeof (module.getVersion) === 'function' ? module.getVersion() : undefined,
                    pointed: module.pointed,
                    section: module.section,
                    browsable: module.browsable === undefined || module.browsable === true
                }

                if (module.config) {
                    extend(true, result.modules[module.domain], module.config);
                }
            }
        });

        result.lists = app.config.lists;

        result.injects = app.config.injects;

        applyArrayInObject('entities', 'entities', 'name');

        applyArrayInObject('roles', 'roles', 'name');

        applyArrayInObject('sections', 'sections', 'name');

        applyArrayInObject('templates', 'templates', 'id');

        applyArrayInObject('layouts', 'layouts', 'id');

        applyArrayInObject('containers', 'containers', 'id');

        applyArrayInObject('routes', 'routes', 'id');

        applyArrayInObject('languages', 'languages', 'code');

        applyArrayInObject('countries', 'countries', 'code');

        result.content = app.config.content;

        result.messaging = {
            mail: {},
            sms: {}
        };

        for (var mailImplementationName in app.config.messaging.mail.implementations) {
            var mailImplementation = app.config.messaging.mail.implementations[mailImplementationName];
            result.messaging.mail[mailImplementationName] = {
                domain: mailImplementationName,
                name: mailImplementation.provider,
                settingsTmpl: mailImplementation.settingsTmpl
            }
        }

        for (var smsImplementationName in app.config.messaging.sms.implementations) {
            var smsImplementation = app.config.messaging.sms.implementations[smsImplementationName];
            result.messaging.sms[smsImplementationName] = {
                domain: smsImplementationName,
                name: smsImplementation.provider,
                settingsTmpl: smsImplementation.settingsTmpl
            }
        }

        result.languages = {};
        _.each(languages, function (language) {
            result.languages[language.code] = language;
        });

        result.countries = {};
        _.each(countries, function (country) {
            result.countries[country.code] = country;
        });

        result.collections = {};

        Object.keys(app.config.collections).forEach(function (collection) {
            result.collections[collection] = {};
            if (app.config.collections[collection].default) {
                result.collections[collection].default = app.config.collections[collection].default;
            }
            if (app.config.collections[collection].permissions) {
                result.collections[collection].permissions = app.config.collections[collection].permissions;
            }
        });
        
        return result;
    }

    return {

        get: function () {

            var scriptSocketIo = fs.readFileSync(path.join(__dirname, '/scripts/socket.io.js'), 'utf8');
            var scriptProxy = fs.readFileSync(path.join(__dirname, '/scripts/proxy.js'), 'utf8');
            var scriptJsnbt = fs.readFileSync(path.join(__dirname, '/scripts/jsnbt.js'), 'utf8');

            var file = scriptSocketIo + "\n\n"
                + scriptProxy + "\n\n"
                
            
            var jsnbtObj = getJsnbtObject();
            file += '\n';
            file += 'var jsnbt = (function (jsnbt) {\n';
            file += '\t \'use strict\';\n';
            file += '\t \n';

            file += '\t jsnbt.on = PROXY.on;;\n';
            file += '\t jsnbt.once = PROXY.once;;\n';
            file += '\t jsnbt.off = PROXY.off;;\n';

            file += '\t \n';

            Object.keys(jsnbtObj).forEach(function (key) {
                file += '\t jsnbt["' + key + '"] = ' + JSON.stringify(jsnbtObj[key], null, '\t') + '; \n\n';
            });

            file += '\t \n';
            file += '\t return jsnbt;\n';
            file += '})(jsnbt || {});\n';

            file += scriptJsnbt + "\n\n";

            return file;
        }

    }

};

module.exports = Script;