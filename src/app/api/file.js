var app = require('../app.js');
var fs = require('../utils/fs.js');
var path = require('path');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

var normalize = function (text) {
    return text.replace(/\//g, '\\');
};

var denormalize = function (text) {
    return text.replace(/\\/g, '/');
};

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};

var getFsObject = function (rootPath, filePath, stats) {
    var result = {
        type: stats.isFile() ? 'file' : 'folder',
        path: denormalize(filePath.substring(rootPath.length)),
        location: 'files' + denormalize(filePath.substring(rootPath.length)),
        name: path.basename(filePath),
        ext: path.extname(filePath),
        dir: denormalize(path.join(path.dirname(filePath), '/').substring(rootPath.length)),
        size: stats.isFile() ? (stats.size / 1024).round(2) : 0
    };

    if (result.dir !== '/')
        result.dir = _.str.rtrim(result.dir, '/');

    return result;
};

var getFolderContents = function (rootPath, folderPath, stats) {
    var results = [];

    var files = fs.readdirSync(folderPath);
    for (var i = 0; i < files.length; i++) {
        var filePath = path.join(folderPath, files[i]);
        var fstats = fs.statSync(filePath);

        var obj = getFsObject(rootPath, filePath, fstats);
        results.push(obj);
    }

    var folderResults = _.filter(results, function (x) { return x.type === 'folder'; });
    var fileResults = _.filter(results, function (x) { return x.type === 'file'; });
    return _.union(folderResults, fileResults);
};

module.exports = {
    
    get: function (user, draft, fields) {

        var defaults = {
            path: undefined,
            paths: undefined
        };

        var opts = {};
        _.extend(opts, defaults);
        _.extend(opts, fields);

        if (!opts.path && !opts.paths)
            throw new Error('path or paths are required');

        var root = 'files';

        var rootPath = path.join(server.getPath(app.root), 'public', root);

        if (opts.path) {

            var fullPath = path.join(server.getPath(app.root), 'public', root, normalize(opts.path));
            if (fs.existsSync(fullPath)) {
                var cstats = fs.statSync(fullPath);
                if (cstats.isFile()) {
                    return getFsObject(rootPath, fullPath, cstats);
                }
                else {
                    return getFolderContents(rootPath, fullPath, cstats);
                }
            }
            else {
                return null;
            }
        }
        else if (opts.paths) {
            var results = [];

            _.each(opts.paths, function (loopPath) {
                var loopFullPath = path.join(server.getPath(app.root), 'public', root, normalize(loopPath));

                if (fs.existsSync(loopFullPath)) {
                    var fstats = fs.statSync(loopFullPath);
                    if (fstats.isFile()) {
                        results.push(getFsObject(rootPath, loopFullPath, fstats));
                    }
                    else {
                        results.push(getFolderContents(rootPath, loopFullPath, fstats));
                    }
                }
                else {
                    results.push(null);
                }
            });

            return results;
        }

    },

    delete: function (user, draft, fields) {

        var defaults = {
            path: undefined
        };

        var opts = {};
        _.extend(opts, defaults);
        _.extend(opts, fields);

        if (!opts.path)
            throw new Error('path is required');

        var root = 'files';

        var fullPath = path.join(server.getPath(app.root), 'public', root, normalize(opts.path));
        if (fs.existsSync(fullPath)) {
            fs.delete(fullPath);
            return true;
        }

        return false;

    },

    create: function (user, draft, fields) {

        var defaults = {
            path: undefined,
            name: undefined
        };

        var opts = {};
        _.extend(opts, defaults);
        _.extend(opts, fields);

        if (!opts.path)
            throw new Error('path is required');

        if (!opts.name)
            throw new Error('name is required');

        var root = 'files';

        var fullPath = path.join(server.getPath(app.root), 'public', root, normalize(opts.path));
        if (fs.existsSync(fullPath)) {
            fs.create(path.join(fullPath, opts.name));
            return true;
        }
        return false;

    },

    move: function (user, draft, fields) {

        var defaults = {
            from: undefined,
            to: undefined
        };

        var opts = {};
        _.extend(opts, defaults);
        _.extend(opts, fields);

        if (!opts.from)
            throw new Error('from is required');

        if (!opts.to)
            throw new Error('to is required');

        var root = 'files';

        var fullPath = path.join(server.getPath(app.root), 'public', root, normalize(opts.from));
        var fullNewPath = path.join(server.getPath(app.root), 'public', root, normalize(opts.to));
        if (fs.existsSync(fullPath)) {
            fs.renameSync(fullPath, fullNewPath);
            return true;
        }

        return false;

    }

};