var fs = require('fs');
var path = require('path');
var _ = require('underscore');

_.str = require('underscore.string');

fs.create = function sync(p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }

    var mode = opts.mode;
    var xfs = opts.fs || fs;

    if (mode === undefined) {
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT':
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

                // In the case of any other error, just see if there's a dir
                // there already.  If so, then hooray!  If not, then something
                // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

fs.copy = function (source, target, override) {
    if (fs.lstatSync(source).isDirectory()) {
        copyFolder(source, target, override);
    }
    else if (fs.lstatSync(source).isFile()) {
        copyFile(source, target, override);
    }
};

fs.delete = function (target) {
    if (fs.lstatSync(target).isDirectory()) {
        deleteFolder(target);
    }
    else if (fs.lstatSync(target).isFile()) {
        deleteFile(target);
    }
};

fs.clean = function (target, recursive) {
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            cleanFolder(target, recursive);
        }
    }
};

module.exports = fs;

function copyFile(source, target, override) {
    var copy = fs.existsSync(target) && override === true ? true : (!fs.existsSync(target) ? true : false);
    if (copy) {
        var targetFolder = target.substring(0, target.lastIndexOf('\\'));
        if (!fs.existsSync(targetFolder))
            fs.create(targetFolder);

        fs.writeFileSync(target, fs.readFileSync(source));
    }
}

function copyFolder(source, target, override) {
    var exists = fs.existsSync(source);
    if (exists) {
        if (fs.lstatSync(source).isDirectory()) {
            if (!fs.existsSync(target))
                fs.create(target);

            fs.readdirSync(source).forEach(function (childItemName) {
                copyFolder(path.join(source, childItemName), path.join(target, childItemName), override);
            });
        }
        else {
            var copy = fs.existsSync(target) && override === true ? true : (!fs.existsSync(target) ? true : false);
            if (copy)
                fs.linkSync(source, target);
        }
    }
}

function deleteFile(file) {
    if (fs.existsSync(file)) {
        if (fs.lstatSync(file).isFile()) {
            fs.unlinkSync(file);
        }
    }
}

function deleteFolder(folder) {
    if (fs.existsSync(folder)) {
        var files = fs.readdirSync(folder);
        files.forEach(function (file) {
            file = folder + "/" + file;
            if (fs.lstatSync(file).isDirectory()) {
                deleteFolder(file);
            } else {
                fs.unlinkSync(file);
            }
        });
        fs.rmdirSync(folder);
    }
}

function cleanFolder(folder, recursive) {
    if (fs.existsSync(folder)) {
        if (fs.lstatSync(folder).isDirectory()) {
            var children = fs.readdirSync(folder);
            if (children.length === 0) {
                fs.rmdirSync(folder);
            }
            else {
                if (recursive) {
                    children.forEach(function (childItemName) {
                        if (fs.lstatSync(folder + '/' + childItemName).isDirectory()) {
                            cleanFolder(folder + '/' + childItemName, recursive);
                        }
                    });
                }

                children = fs.readdirSync(folder);
                if (children.length === 0) {
                    fs.rmdirSync(folder);
                }
            }
        }
    }
}