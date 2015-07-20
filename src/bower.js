var fs = require('fs-extra');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = {

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
    }

};