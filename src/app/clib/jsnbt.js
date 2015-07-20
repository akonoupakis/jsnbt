var fs = require('fs-extra');
var path = require('path');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

var JsnbtObject = function (app) {

    var getResources = function () {

        var resources = [];

        Object.keys(app.config.collections).forEach(function (collectionName) {

            var collection = app.config.collections[collectionName];

            var config = {
                type: (collection.users === true ? 'User' : '') + 'Collection',
                properties: {},
                events: collection.events || {}
            };

            var propertyKeys = _.keys(collection.schema.properties);

            _.each(propertyKeys, function (propertyKey, propertyIndex) {

                var collectionProperty = collection.schema.properties[propertyKey];

                var propertyRequired = collectionProperty.type === 'boolean' ? false : (collectionProperty.required || false);

                var property = {
                    name: propertyKey,
                    type: collectionProperty.type,
                    typeLabel: propertyKey,
                    required: propertyRequired,
                    id: propertyKey,
                    order: propertyIndex
                };

                config.properties[propertyKey] = property;
            });

            var o = {
                config: config
            }

            var rType = collection.users ?
                require('../resources/user-collection.js') :
                require('../resources/collection.js');
            var resource = new rType(collectionName, o);
            resources.push(resource);
        });

        return resources;
    };

    return {

        get: function () {

            var scriptSocketIo = fs.readFileSync(path.join(__dirname, '/scripts/socket.io.js'), 'utf8');
            var scriptAjax = fs.readFileSync(path.join(__dirname, '/scripts/ajax.js'), 'utf8');
            var scriptDpd = fs.readFileSync(path.join(__dirname, '/scripts/dpd.js'), 'utf8');

            var file = scriptSocketIo + "\n\n"
                + scriptAjax + "\n\n"
                + scriptDpd + "\n\n";

            var resources = getResources();

            _.each(resources, function (r) {
                var rpath = r.path;
                var jsName = r.path.replace(/[^A-Za-z0-9]/g, '')
                  , i;

                if (rpath.indexOf('/dpd/') == 0) {
                    rpath = rpath.substring('dpd'.length + 1);
                    jsName = rpath.replace(/[^A-Za-z0-9]/g, '');
                }

                if (r.clientGeneration && jsName) {
                    file += 'dpd.' + jsName + ' = dpd("' + r.path + '");\n';
                    if (r.clientGenerationExec) {
                        for (i = 0; i < r.clientGenerationExec.length; i++) {
                            file += 'dpd.' + jsName + '.' + r.clientGenerationExec[i] + ' = function(path, body, fn) {\n';
                            file += '  return dpd.' + jsName + '.exec("' + r.clientGenerationExec[i] + '", path, body, fn);\n';
                            file += '}\n';
                        }
                    }
                    if (r.clientGenerationGet) {
                        for (i = 0; i < r.clientGenerationGet.length; i++) {
                            file += 'dpd.' + jsName + '.' + r.clientGenerationGet[i] + ' = function(path, query, fn) {\n';
                            file += '  return dpd.' + jsName + '.get("' + r.clientGenerationGet[i] + '", path, query, fn);\n';
                            file += '}\n';
                        }
                    }
                    // resource event namespacing sugar
                    file += 'dpd.' + jsName + '.on = function(ev, fn) {\n';
                    file += '  return dpd.on("' + r.path.replace('/', '') + '" + ":" + ev, fn);\n';
                    file += '}\n';
                    file += 'dpd.' + jsName + '.once = function(ev, fn) {\n';
                    file += '  return dpd.once("' + r.path.replace('/', '') + '" + ":" + ev, fn);\n';
                    file += '}\n';
                    file += 'dpd.' + jsName + '.off = function(ev, fn) {\n';
                    file += '  return dpd.off("' + r.path.replace('/', '') + '" + ":" + ev, fn);\n';
                    file += '}\n';
                }

                if (r.external) {
                    Object.keys(r.external).forEach(function (name) {
                        file += 'dpd.' + jsName + '.' + name + ' = function (path, body, fn) {\n';
                        file += '  dpd.' + jsName + '.exec("' + name + '", path, body, fn);\n';
                        file += '}\n';
                    });
                }

                file += '\n';
            });

            return file;

        }

    }

};

module.exports = JsnbtObject;