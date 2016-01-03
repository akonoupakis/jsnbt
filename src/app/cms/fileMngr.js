var fs = require('fs-extra');
var path = require('path');
var extend = require('extend');
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

var FileManager = function (server) {

    this.server = server;

};

FileManager.prototype.get = function (paths, cb) {
    var self = this;

    var isArray = _.isArray(paths);
    var filePaths = _.isArray(paths) ? paths : [paths];
    var filePath = _.isString(paths) ? paths : undefined;

    var root = 'files';

    var rootPath = path.join(self.server.getPath('www'), 'public', root);

    if (!isArray && filePath) {

        var fullPath = path.join(self.server.getPath('www'), 'public', root, normalize(filePath));
        if (fs.existsSync(fullPath)) {
            var cstats = fs.statSync(fullPath);
            if (cstats.isFile()) {
                cb(null, getFsObject(rootPath, fullPath, cstats));
            }
            else {
                cb(null, getFolderContents(rootPath, fullPath, cstats));
            }
        }
        else {
            cb();
        }
    }
    else {
        var results = [];

        _.each(filePaths, function (loopPath) {
            var loopFullPath = path.join(self.server.getPath('www'), 'public', root, normalize(loopPath));

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

        return cb(null, results);
    }

};

FileManager.prototype.delete = function (paths, cb) {
    var self = this;

    var root = 'files';

    var fullPath = path.join(self.server.getPath('www'), 'public', root, normalize(paths));
    fs.exists(fullPath, function (err, res) {
        if (!err) {
            fs.remove(fullPath, function (rErr, rRes) {
                return cb(null, true);
            });
        }
        else {
            return cb(null, true);
        }
    });
};

FileManager.prototype.create = function (dir, fileName, cb) {
    var self = this;

    var root = 'files';

    var fullPath = path.join(self.server.getPath('www'), 'public', root, normalize(dir));
    fs.exists(fullPath, function (err, res) {
        if (err)
            return cb(err);
        
        fs.mkdirs(path.join(fullPath, fileName), function (mErr, mRes) {
            cb(null, true);
        });
    });
};

FileManager.prototype.move = function (from, to, cb) {
    var self = this;

    var root = 'files';

    var fullPath = path.join(self.server.getPath('www'), 'public', root, normalize(from));
    var fullNewPath = path.join(self.server.getPath('www'), 'public', root, normalize(to));

    fs.exists(fullPath, function (err, res) {
        if (err)
            return cb(err);

        if (res) {
            fs.exists(fullNewPath, function (rErr, rRes) {
                if (rErr)
                    return cb(rErr);

                if (!rRes) {
                    fs.copy(fullPath, fullNewPath, function (cErr, cRes) {
                        if (cErr)
                            return cb(cErr);

                        fs.remove(fullPath, function (reErr, reRes) {
                            if (reErr)
                                return cb(reErr);
                            
                            cb(null, true);
                        });
                    });
                }
                else {
                    cb(null, false);
                }
            });
        }
        else {
            cb(null, false);
        }
    });

};

module.exports = function (server) {
    return new FileManager(server);
};