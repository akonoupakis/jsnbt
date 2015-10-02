var fs = require('fs-extra');
var path = require('path');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

var copyModule = function (sourcePath, targetPath) {
    var packageInfoPath = path.join(sourcePath, 'package.json');
    if (fs.existsSync(packageInfoPath)) {
        var folderPath = path.dirname(packageInfoPath);
        var packInfo = require(packageInfoPath);
        var modulePaths = _.map(packInfo.files, function (x) {
            return _.str.rtrim(x, '*');
        });
        
        modulePaths.push('package.json');

        _.each(modulePaths, function (modulePath) {
            fs.copySync(path.join(folderPath, modulePath), path.join(targetPath, modulePath));
        });
    }
}

module.exports = {
    npm: {

        install: function (name, force) {
            if (!fs.existsSync(server.getPath('npm/' + name)))
                throw new Error('npm module not found: ' + name);

            if (!fs.lstatSync(server.getPath('npm/' + name)).isDirectory())
                throw new Error('npm module not a directory: ' + name);

            if (!fs.lstatSync(server.getPath('npm/' + name + '/package.json')).isFile())
                throw new Error('npm module does not have a package.json file: ' + name);

            if (fs.existsSync(server.getPath('node_modules/' + name)))
                if (force === true)
                    fs.deleteSync(server.getPath('node_modules/' + name));

            if (!fs.existsSync(server.getPath('node_modules/' + name))) 
                copyModule(server.getPath('npm/' + name), server.getPath('node_modules/' + name));

            this.pack(name, force);
        },

        pack: function (name, force) {
            if (fs.existsSync(server.getPath('node_modules/' + name))) {
                var sourcePath = server.getPath('node_modules/' + name + '/src');
                var targetPath = server.getPath('src/pck/' + name);

                if (fs.existsSync(sourcePath)) {
                    if (fs.existsSync(targetPath)) {
                        if (force) {
                            fs.deleteSync(targetPath);
                            fs.copySync(sourcePath, targetPath);
                        }
                    }
                    else {
                        fs.copySync(sourcePath, targetPath);
                    }
                }
            }
        },

        unpack: function (name) {
            var targetPath = server.getPath('src/pck/' + name);
            if (fs.existsSync(targetPath)) {
                fs.deleteSync(targetPath, true);
            }
        }

    },

    bower: {

        install: function (name, force) {
            if (!fs.existsSync(server.getPath('bower/' + name)))
                throw new Error('bower module not found: ' + name);

            if (!fs.lstatSync(server.getPath('bower/' + name)).isDirectory())
                throw new Error('bower module not a directory: ' + name);

            if (fs.existsSync(server.getPath('bower_components/' + name)))
                if (force === true)
                    fs.deleteSync(server.getPath('bower_components/' + name));

            if (!fs.existsSync(server.getPath('bower_components/' + name)))
                fs.copySync(server.getPath('bower/' + name), server.getPath('bower_components/' + name));
        },

        pack: function (name, force) {

        },

        unpack: function (name) {

        }

    }
};