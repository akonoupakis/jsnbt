var app = require('./app.js');
var jsnbt = require('./jsnbt.js');
var fs = require('./utils/fs.js');
var extend = require('extend');
var _ = require('underscore');

_.str = require('underscore.string');

exports.parse = function (ctx, tmpl, model) {
    var mdl = {
        baseHref: ctx.uri.getBaseHref(),
        language: ctx.language || 'en',
        view: ctx.view || '',
        node: ctx.node || {},
        pointer: ctx.pointer || {},
        layout: ctx.layout || '',
        meta: {
            title: '',
            keywords: '',
            description: ''
        },
        robots: ''
    };

    extend(true, mdl.meta, ctx.meta);
    extend(true, mdl, model);

    mdl.nodeId = (mdl.node || {}).id;
    mdl.pointerId = (mdl.pointer || {}).id;

    var isAdmin = ctx.uri.first === 'admin';

    if (isAdmin) {
        mdl.baseHref += 'admin/';
    }

    var robotNames = [];
    for (var robotName in ctx.robots) {
        if (ctx.robots[robotName] === true)
            robotNames.push(robotName);
    }

    if (robotNames.length > 0)
        mdl.robots = robotNames.join(',');

    mdl.js = {};

    mdl.scripts = isAdmin ? jsnbt.scripts : [];
    
    if (isAdmin) {
        var appFiles = [];
        findJsFiles('../' + app.root + '/public/admin/js/core/app/', appFiles, true);

        _.each(jsnbt.modules, function (pack) {
            if (pack.domain !== 'core') {
                if (fs.existsSync('../' + app.root + '/public/admin/js/' + pack.domain + '/app/')) {
                    findJsFiles('../' + app.root + '/public/admin/js/' + pack.domain + '/app/', appFiles, true);
                }
            }
        });

        mdl.js.app = appFiles;


        var libFiles = [];
        findJsFiles('../' + app.root + '/public/admin/js/core/lib/', libFiles, true);

        _.each(jsnbt.modules, function (pack) {
            if (pack.domain !== 'core') {
                if (fs.existsSync('../' + app.root + '/public/admin/js/' + pack.domain + '/lib/')) {
                    findJsFiles('../' + app.root + '/public/admin/js/' + pack.domain + '/lib/', libFiles, true);
                }
            }
        });

        mdl.js.lib = libFiles;
    }
    else {
        var appFiles = [];
        findJsFiles('../' + app.root + '/public/js/app/', appFiles, false);
        mdl.js.app = appFiles;

        var libFiles = [];
        findJsFiles('../' + app.root + '/public/js/lib/', libFiles, false);
        mdl.js.lib = libFiles;
    }
    
    if (!mdl.meta.title || mdl.meta.title === '') {
        mdl.meta.title = app.title;
    }
    else {
        mdl.meta.title = mdl.meta.title;
    }

    html = _.template(tmpl, mdl);

    return html;
};

var findJsFiles = function (paths, files, isAdmin) {
    if (!_.str.endsWith(paths, '/'))
        paths += '/';

    if (fs.existsSync(paths)) {
        var filesInternal = fs.readdirSync(paths);
        filesInternal.forEach(function (file) {

            if (fs.lstatSync(paths + file).isFile()) {

                var targetFile = (paths + file);
                if (isAdmin)
                    targetFile = targetFile.substring(targetFile.indexOf('/public/admin/') + '/public/admin/'.length);
                else
                    targetFile = targetFile.substring(targetFile.indexOf('/public/') + '/public/'.length);

                files.push(targetFile);
            }
        });

        filesInternal.forEach(function (file) {
            if (fs.lstatSync(paths + file).isDirectory()) {
                findJsFiles(paths + file + '/', files, isAdmin);
            }
        });
    }
};