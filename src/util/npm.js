var fs = require('./fs.js');
var path = require('path');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = {

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
        if (fs.existsSync(server.getPath('node_modules/' + name))) {
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
        }
    },

    unpack: function (name) {
        var targetPath = server.getPath('src/pck/' + name);
        if (fs.existsSync(targetPath)) {
            fs.delete(targetPath, true);
        }
    }
};