﻿var fs = require('fs-extra');
var path = require('path');
var extend = require('extend');
var _ = require('underscore');

_.str = require('underscore.string');

var Script = function (app) {

    var languages = require('../data/store/languages.js');
    var countries = require('../data/store/countries.js');

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
            var scriptAjax = fs.readFileSync(path.join(__dirname, '/scripts/ajax.js'), 'utf8');
            var scriptProxy = fs.readFileSync(path.join(__dirname, '/scripts/proxy.js'), 'utf8');
            var scriptJsnbt = fs.readFileSync(path.join(__dirname, '/scripts/jsnbt.js'), 'utf8');

            var file = scriptSocketIo + "\n\n"
                + scriptAjax + "\n\n"
                + scriptProxy + "\n\n"
                + scriptJsnbt + "\n\n";

            var resources = getResources();

            if (resources.length > 0) {

                file += '\n';
                file += 'var jsnbt = (function (jsnbt) {\n';
                file += '\t \'use strict\';\n';
                file += '\t \n';

                file += '\n';
                file += 'jsnbt.db = (function (db) {\n';
                file += '\t \'use strict\';\n';
                file += '\t \n';

                _.each(resources, function (r) {
                    var rpath = r['name'];
                    var jsName = r['name']
                      , i;

                    if (rpath.indexOf('/jsnbt-db/') == 0) {
                        rpath = rpath.substring('jsnbt-db'.length + 1);
                        jsName = rpath;
                    }
                    r.clientGeneration = true;

                    if (r.clientGeneration && jsName) {
                        file += 'db.' + jsName + ' = PROXY("' + r['name'] + '");\n';
                        if (r.clientGenerationExec) {
                            for (i = 0; i < r.clientGenerationExec.length; i++) {
                                file += 'db.' + jsName + '.' + r.clientGenerationExec[i] + ' = function(path, body, fn) {\n';
                                file += '  return db.' + jsName + '.exec("' + r.clientGenerationExec[i] + '", path, body, fn);\n';
                                file += '}\n';
                            }
                        }

                        file += 'db.' + jsName + '.on = function(ev, fn) {\n';
                        file += '  return PROXY.on("' + r['name'].replace('/', '') + '" + ":" + ev, fn);\n';
                        file += '}\n';
                        file += 'db.' + jsName + '.once = function(ev, fn) {\n';
                        file += '  return PROXY.once("' + r['name'].replace('/', '') + '" + ":" + ev, fn);\n';
                        file += '}\n';
                        file += 'db.' + jsName + '.off = function(ev, fn) {\n';
                        file += '  return PROXY.off("' + r['name'].replace('/', '') + '" + ":" + ev, fn);\n';
                        file += '}\n';
                    }

                    file += '\n';
                });

                file += '\t \n';
                file += '\t return db;\n';
                file += '})(jsnbt.db || {});\n';

                file += '\t \n';
                file += '\t return jsnbt;\n';
                file += '})(jsnbt || {});\n';

                file += '\n';
            }

            var jsnbtObj = getJsnbtObject();
            file += '\n';
            file += 'var jsnbt = (function (jsnbt) {\n';
            file += '\t \'use strict\';\n';
            file += '\t \n';

            Object.keys(jsnbtObj).forEach(function (key) {
                file += '\t jsnbt["' + key + '"] = ' + JSON.stringify(jsnbtObj[key], null, '\t') + '; \n\n';
            });

            file += '\t \n';
            file += '\t return jsnbt;\n';
            file += '})(jsnbt || {});\n';

            return file;
        }

    }

};

module.exports = Script;