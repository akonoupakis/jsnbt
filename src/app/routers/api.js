var app = require('../app.js');
var dpdSync = require('dpd-sync');
var error = require('../error.js');
var formidable = require('formidable');

module.exports = function () {

    return {
        sync: true,
        route: function (ctx, next) {
            if (ctx.uri.first === 'jsnbt-api') {
                if (ctx.req.method !== 'POST') {
                    ctx.res.writeHead(405, { "Content-Type": "application/json" });
                    ctx.res.end();
                }
                if (ctx.uri.parts.length != 3) {
                    ctx.res.writeHead(400, { "Content-Type": "application/json" });
                    ctx.res.end();
                }
                else {
                    var form = new formidable.IncomingForm();
                    form.parse(ctx.req, function (err, fields, files) {
                        if (err) {
                            ctx.res.writeHead(500, { "Content-Type": "application/text" });
                            ctx.res.write(err.toString());
                            ctx.res.end();
                        }
                        else {
                            dpdSync.wrap(proceedFn, ctx, fields, next);
                        }
                    });
                }
            }
            else {
                next();
            }
        }
    };
};

var proceedFn = function (ctx, fields, next) {
    try {
        var domainName = ctx.uri.parts[1];
        var serviceName = ctx.uri.parts[2];

        if (domainName == 'core') {
            var service = null;
            try {
                service = require('../api/' + serviceName + '.js');
            }
            catch (e) { }

            if (service !== null && fields.fn) {
                if (typeof (service[fields.fn]) === 'function') {
                    var result = service[fields.fn].apply(service[fields.fn], [ctx.req.session.user, fields.preview, fields]);
                    ctx.res.writeHead(200, { "Content-Type": "application/json" });
                    ctx.res.write(JSON.stringify({ d: result }, null, '\t'));
                    ctx.res.end();
                }
                else {
                    ctx.res.writeHead(404, { "Content-Type": "application/json" });
                    ctx.res.end();
                }
            }
            else {
                ctx.res.writeHead(404, { "Content-Type": "application/json" });
                ctx.res.end();
            }
        }
        else {
            ctx.params = fields;

            var nextIndex = 0;
            var nextInternal = function () {
                nextIndex++;
                var router = addonRouters[nextIndex];
                router.route(ctx, nextInternal);
            };

            var first = _.first(addonRouters);
            first.route(ctx, nextInternal);
        }
    }
    catch (err) {
        ctx.res.writeHead(500, { "Content-Type": "application/json" });
        ctx.res.write(err.toString());
        ctx.res.end();
    }
};