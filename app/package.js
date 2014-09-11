var fs = require('./utils/fs.js');
var path = require('path');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = {

    bower: {
        install: function (name, force) {
            if (!fs.existsSync(server.getPath('bower/' + name)))
                throw new Error('bower module not found: ' + name);

            if (!fs.lstatSync(server.getPath('bower/' + name)).isDirectory())
                throw new Error('bower module not a directory: ' + name);

            if (fs.existsSync(server.getPath('bower_components/' + name)))
                if (force === true)
                    fs.delete(server.getPath('bower_components/' + name));

            if (!fs.existsSync(server.getPath('bower_components/' + name)))
                fs.copy(server.getPath('bower/' + name), server.getPath('bower_components/' + name));
        }
    },

    npm: {

        getInstalled: function () {
            var installed = [];
            var found = fs.readdirSync(server.getPath('node_modules'));
            for (var i in found) {
                if (_.str.startsWith(found[i], 'jsnbt-')) {
                    installed.push(found[i]);
                }
            }
            return installed;
        },

        install: function (name, force) {
            if (!fs.existsSync(server.getPath('npm/' + name)))
                throw new Error('npm module not found: ' + name);

            if (!fs.lstatSync(server.getPath('npm/' + name)).isDirectory())
                throw new Error('npm module not a directory: ' + name);

            if (fs.existsSync(server.getPath('node_modules/' + name)))
                if (force === true)
                    fs.delete(server.getPath('node_modules/' + name));

            if (!fs.existsSync(server.getPath('node_modules/' + name)))
                fs.copy(server.getPath('npm/' + name), server.getPath('node_modules/' + name));

            this.pack(name, force);
        },

        pack: function (name, force) {
            if (!fs.existsSync(server.getPath('node_modules/' + name)) && name !== 'jsnbt')
                throw new Error('npm module not installed in node_modules: ' + name);

            var sourcePath = server.getPath('node_modules/' + name + '/src');
            var targetPath = server.getPath('src/pck/' + name);

            if (fs.existsSync(sourcePath)) {
                if (fs.existsSync(targetPath)) {
                    if (force) {
                        fs.delete(targetPath, true);
                        fs.copy(sourcePath, targetPath);
                    }
                }
                else {
                    fs.copy(sourcePath, targetPath);
                }
            }
        },

        unpack: function (name) {
            var targetPath = server.getPath('src/pck/' + name);
            if (fs.existsSync(targetPath)) {
                fs.delete(targetPath, true);
            }
        },

        deploy: function (name, folder) {
            if (fs.existsSync(server.getPath('src/pck/' + name))) {
                deployFiles(server.getPath('src/pck/' + name + '/web/public'), server.getPath(folder + '/public'));
                deployFiles(server.getPath('src/pck/' + name + '/web/admin'), server.getPath(folder + '/public/admin'));

                var resourcesFolder = server.getPath('src/pck/' + name + '/dpd/resources');
                if (fs.existsSync(resourcesFolder)) {
                    var resources = fs.readdirSync(resourcesFolder);
                    for (var ii in resources) {
                        var resourceName = resources[ii];
                        var configFile = resourcesFolder + '/' + resourceName + '/config.json';
                        var config = JSON.parse(fs.readFileSync(configFile));

                        var targetFolder = server.getPath(folder + '/resources/' + resourceName);
                        var targetFile = server.getPath(folder + '/resources/' + resourceName + '/config.json');
                        if (!fs.existsSync(targetFolder)) {
                            fs.mkdirSync(targetFolder);
                            fs.writeFileSync(targetFile, JSON.stringify(config, null, '\t'), 'utf-8');
                        }
                        else {
                            var targetConfig = JSON.parse(fs.readFileSync(targetFile));
                            var targetProperties = targetConfig.properties || {};

                            if (config.properties) {
                                for (var item in config.properties) {
                                    if (targetProperties[item] === undefined) {
                                        targetProperties[item] = config.properties[item];
                                    }
                                }
                            }

                            targetConfig.properties = targetProperties;
                            fs.writeFileSync(targetFile, JSON.stringify(targetConfig, null, '\t'), 'utf-8');
                        }
                    }
                }
            }
        }

    }
};

var deployFiles = function (source, target) {
    fs.copy(source, target, false);
    diffLessFile(source + '/css/_.less', target + '/css/_.less');
};

var diffLessFile = function (source, target) {
    if (fs.existsSync(source)) {
        if (fs.existsSync(target)) {
            var sourceLines = fs.readFileSync(source, 'utf-8').split('\n');
            var targetLines = fs.readFileSync(target, 'utf-8').split('\n');
            var changed = false;

            for (var i = 0; i < sourceLines.length; i++) {
                if (targetLines.indexOf(sourceLines[i]) == -1) {
                    targetLines.push(sourceLines[i]);
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(target, targetLines.join('\n'), 'utf-8');
            }
        }
    }
};