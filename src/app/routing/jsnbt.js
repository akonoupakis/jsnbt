var extend = require('extend');
var _ = require('underscore');

var languages = require('../storage/languages.js');
var countries = require('../storage/countries.js');

var JsnbtRouter = function (server) {

    var logger = require('../logger.js')(this);

    var getJsnbtObject = function () {

        var result = {
            version: server.version,
            localization: server.app.localization,
            restricted: server.app.restricted,
            ssl: server.app.ssl
        };

        var applyArrayInObject = function (selfName, resultName, identifier) {
            result[resultName] = {};
            _.each(server.app.config[selfName], function (selfItem) {
                result[resultName][selfItem[identifier]] = selfItem;
            });
        };

        result.fileGroups = server.app.config.fileGroups;

        result.modules = {};
        _.each(server.app.modules.all, function (module) {

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

                if (module.config) {
                    extend(true, result.modules[module.domain], module.config);
                }
            }
        });

        result.lists = [];
        _.each(server.app.config.lists, function (list) {
            var newList = {};
            extend(true, newList, list);
            delete newList.permissions;
            result.lists.push(newList);
        });

        result.injects = server.app.config.injects;

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

        for (var mailImplementationName in server.app.config.messaging.mail.implementations) {
            var mailImplementation = server.app.config.messaging.mail.implementations[mailImplementationName];
            result.messaging.mail[mailImplementationName] = {
                domain: mailImplementationName,
                name: mailImplementation.provider,
                settingsTmpl: mailImplementation.settingsTmpl
            }
        }

        for (var smsImplementationName in server.app.config.messaging.sms.implementations) {
            var smsImplementation = server.app.config.messaging.sms.implementations[smsImplementationName];
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

        return result;
    }

    return {

        route: function (ctx, next) {
            if (ctx.uri.path === '/jsnbt.js') {
                if (ctx.method !== 'GET') {
                    ctx.error(405);
                }
                else {
                    try {

                        var result = getJsnbtObject();

                        ctx.writeHead(200, { "Content-Type": "application/javascript" });

                        ctx.write('var jsnbt = ' + JSON.stringify(result, null, server.app.dbg ? '\t' : ''));
                        ctx.end();
                    }
                    catch (err) {
                        logger.error(ctx.req.method, ctx.req.url, err);
                        ctx.error(500, err, 'application/text');
                    }
                }
            }
            else {
                next();
            }
        }

    };

};

module.exports = JsnbtRouter;