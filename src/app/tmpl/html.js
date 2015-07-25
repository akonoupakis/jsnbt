var extend = require('extend');
var _ = require('underscore');

_.str = require('underscore.string');

var Parser = function (server) {

    var bundle = require('./bundle.js')(server.app);
    
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
            name: 'generator',
            content: 'jsnbt content management'
        }, {
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

        var installedTemplate = _.find(server.app.config.templates, function (x) { return x.id === ctx.template; });

        var styleBundle = bundle.getStyleBundle(installedTemplate.styles);
        mdl.styles = styleBundle.items;

        var scriptBundle = bundle.getScriptBundle(installedTemplate.scripts);
        mdl.scripts = scriptBundle.items;
        
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