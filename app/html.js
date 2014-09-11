var app = require('./app.js');
var fs = require('./utils/fs.js');
var _ = require('underscore');

_.str = require('underscore.string');

exports.parse = function (ctx, tmpl, model) {

    var mdl = {
        baseHref: ctx.uri.getBaseHref(),
        language: 'en',
        meta: {
            title: '',
            keywords: '',
            description: ''
        }
    };

    _.extend(mdl.meta, ctx.meta);
    _.extend(mdl, model);

    var isAdmin = ctx.uri.first === 'admin';

    if (isAdmin) {
        mdl.baseHref += 'admin/';
    }
    else {
        var session = app.session.start(ctx.req, ctx.res);
        mdl.language = session.get('language');
    }

    mdl.js = {};

    var appFiles = [];
    findJsFiles('../' + app.root + '/public/' + (isAdmin ? 'admin/' : '') + 'js/app/', appFiles, isAdmin);
    mdl.js.app = appFiles;

    var libFiles = [];
    findJsFiles('../' + app.root + '/public/' + (isAdmin ? 'admin/' : '') + 'js/lib/', libFiles, isAdmin);
    mdl.js.lib = libFiles;

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