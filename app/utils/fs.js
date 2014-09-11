var fs = require('fs');
var path = require('path');
var _ = require('underscore');

_.str = require('underscore.string');

fs.create = function (target) {
    mkdir(target);
};

fs.copy = function (source, target, override) {
    if (fs.lstatSync(source).isDirectory()) {
        console.log('copy1');
        copyFolder(source, target, override);
    }
    else if (fs.lstatSync(source).isFile()) {
        console.log('copy2');
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
    if (copy)
        fs.writeFileSync(target, fs.readFileSync(source));
}

function copyFolder(source, target, override) {
    var exists = fs.existsSync(source);
    if (exists) {
        if (fs.lstatSync(source).isDirectory()) {
            if (!fs.existsSync(target))
                mkdir(target);

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

function mkdir(path, root) {

    var dirs = path.split('/'), dir = dirs.shift(), rootFolder = (root || '') + dir + '/';

    try { fs.mkdirSync(rootFolder); }
    catch (e) {
        if (!fs.statSync(rootFolder).isDirectory()) throw new Error(e);
    }

    return !dirs.length || mkdir(dirs.join('/'), rootFolder);
}