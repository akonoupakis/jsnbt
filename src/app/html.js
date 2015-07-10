var fs = require('fs');
var extend = require('extend');
var _ = require('underscore');

_.str = require('underscore.string');

var Parser = function (server) {

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
    }

    var prepare = function (ctx, tmpl, model, callback) {
        var mdl = {
            baseHref: ctx.uri.getBaseHref(),
            language: ctx.language || 'en',
            meta: {
                title: '',
                keywords: '',
                description: ''
            },
            params: [],
            robots: ''
        };

        extend(true, mdl.meta, ctx.meta);
        extend(true, mdl, model);

        mdl.params = mdl.params || [];

        mdl.params = _.union([{
            name: 'layout',
            content: ctx.layout
        }, {
            name: 'page',
            content: (ctx.node || {}).id
        }, {
            name: 'pointer',
            content: (ctx.pointer || {}).id
        }], ctx.params);

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

        mdl.scripts = isAdmin ? server.jsnbt.scripts : [];

        if (isAdmin) {

            var appFiles = [];
            findJsFiles('../www/public/admin/js/core/app/', appFiles, true);

            _.each(server.app.modules.all, function (pack) {

                if (pack.domain !== 'core') {
                    if (fs.existsSync('../www/public/admin/js/' + pack.domain + '/app/')) {
                        findJsFiles('../www/public/admin/js/' + pack.domain + '/app/', appFiles, true);
                    }
                }
            });

            mdl.js.app = appFiles;

            var libFiles = [];
            findJsFiles('../www/public/admin/js/core/lib/', libFiles, true);

            _.each(server.app.modules.all, function (pack) {
                if (pack.domain !== 'core') {
                    if (fs.existsSync('../www/public/admin/js/' + pack.domain + '/lib/')) {
                        findJsFiles('../www/public/admin/js/' + pack.domain + '/lib/', libFiles, true);
                    }
                }
            });

            mdl.js.lib = libFiles;
        }
        else {
            var appFiles = [];
            findJsFiles('../www/public/js/app/', appFiles, false);
            mdl.js.app = appFiles;

            var libFiles = [];
            findJsFiles('../www/public/js/lib/', libFiles, false);
            mdl.js.lib = libFiles;
        }

        if (!mdl.meta.title || mdl.meta.title === '') {
            mdl.meta.title = server.app.title;
        }
        else {
            mdl.meta.title = mdl.meta.title;
        }

        var preparsingContext = {
            model: mdl,
            tmpl: tmpl
        };

        callback(preparsingContext);
    };

    var preparse = function (ctx, preparsingContext, callback) {
        if (!ctx.halt && ctx.uri.first !== 'admin') {
            var preparser = require('./parsing/preparser.js')(server, ctx);
            preparser.process(preparsingContext, callback);
        }
        else {
            callback(preparsingContext);
        }
    };

    var parse = function (ctx, preparsingContext, callback) {
        var html = _.template(preparsingContext.tmpl)(preparsingContext.model);
        callback(html);
    };

    var postParse = function (ctx, html, callback) {
        var postparsingContext = {
            html: html
        };

        if ((ctx.uri.query.dbg || '').toLowerCase() === 'true' && server.app.dbg) {
            var injectedDbgHtml = '\t<script type="text/javascript">console.log("dbg uri", JSON.parse(\'' + JSON.stringify(ctx.uri, null, '') + '\')); </script>\n' +
                '\t<script type="text/javascript">console.log("dbg watch", JSON.parse(\'' + JSON.stringify(ctx.timer.get(), null, '') + '\')); </script>';

            postparsingContext.html = postparsingContext.html.replace('</body>', injectedDbgHtml + '\n</body>');
        }

        if (!ctx.halt && ctx.uri.first !== 'admin') {
            var postparser = require('./parsing/postparser.js')(server, ctx);
            postparser.process(postparsingContext, function (postParsedContext) {
                callback(postParsedContext.html);
            });
        }
        else {
            callback(postparsingContext.html);
        }
    };

    return {

        parse: function (ctx, tmpl, model, callback) {

            prepare(ctx, tmpl, model, function (preparsingContext) {
                preparse(ctx, preparsingContext, function (preparsedContext) {
                    parse(ctx, preparsedContext, function (parsedHtml) {
                        postParse(ctx, parsedHtml, function (postParsedHtml) {
                            callback(postParsedHtml);
                        });
                    });
                })
            });

        }

    };

};

module.exports = Parser;