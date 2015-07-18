var path = require('path');
var fs = require('fs');
var async = require('async');

var DpdRouter = function (server) {
    
    var logger = require('../logger.js')(this);

    return {

        route: function (ctx, next) {
            if (ctx.uri.path === '/dpd.js') {
                if (ctx.method !== 'GET') {
                    ctx.error(405);
                }
                else {
                    try {

                        var load = function (fn) {

                            async.parallel({
                                dpdJs: function (callback) {
                                    fs.readFile(path.join(__dirname, '../clib/dpd.js'), 'utf-8', callback);
                                },
                                socketIo: function (callback) {
                                    fs.readFile(path.join(__dirname, '../clib/socket.io.js'), 'utf-8', callback);
                                },
                                ajax: function (callback) {
                                    fs.readFile(path.join(__dirname, '../clib/ajax.js'), 'utf-8', callback);
                                }
                            }, function (err, results) {
                                if (err) return fn(err);
                                var file = results.socketIo + "\n\n"
                                         + results.ajax + "\n\n"
                                         + results.dpdJs;
                                fn(file);
                            });
                        };

                        var generate = function (res, fn) {

                            res.write('\n\n// automatically generated code\n\n');
                            server.resources.forEach(function (r) {
                                generateResource(r, res);
                            });

                            fn();
                        };

                        var generateResource = function (r, res) {
                            var rpath = r.path;
                            var jsName = r.path.replace(/[^A-Za-z0-9]/g, '')
                              , i;

                            if (rpath.indexOf('/dpd/') == 0) {
                                rpath = rpath.substring('dpd'.length + 1);
                                jsName = rpath.replace(/[^A-Za-z0-9]/g, '');
                            }

                            if (r.clientGeneration && jsName) {
                                res.write('dpd.' + jsName + ' = dpd("' + r.path + '");\n');
                                if (r.clientGenerationExec) {
                                    for (i = 0; i < r.clientGenerationExec.length; i++) {
                                        res.write('dpd.' + jsName + '.' + r.clientGenerationExec[i] + ' = function(path, body, fn) {\n');
                                        res.write('  return dpd.' + jsName + '.exec("' + r.clientGenerationExec[i] + '", path, body, fn);\n');
                                        res.write('}\n');
                                    }
                                }
                                if (r.clientGenerationGet) {
                                    for (i = 0; i < r.clientGenerationGet.length; i++) {
                                        res.write('dpd.' + jsName + '.' + r.clientGenerationGet[i] + ' = function(path, query, fn) {\n');
                                        res.write('  return dpd.' + jsName + '.get("' + r.clientGenerationGet[i] + '", path, query, fn);\n');
                                        res.write('}\n');
                                    }
                                }
                                // resource event namespacing sugar
                                res.write('dpd.' + jsName + '.on = function(ev, fn) {\n');
                                res.write('  return dpd.on("' + r.path.replace('/', '') + '" + ":" + ev, fn);\n');
                                res.write('}\n');
                                res.write('dpd.' + jsName + '.once = function(ev, fn) {\n');
                                res.write('  return dpd.once("' + r.path.replace('/', '') + '" + ":" + ev, fn);\n');
                                res.write('}\n');
                                res.write('dpd.' + jsName + '.off = function(ev, fn) {\n');
                                res.write('  return dpd.off("' + r.path.replace('/', '') + '" + ":" + ev, fn);\n');
                                res.write('}\n');
                            }

                            if (r.external) {
                                Object.keys(r.external).forEach(function (name) {
                                    res.write('dpd.' + jsName + '.' + name + ' = function (path, body, fn) {\n');
                                    res.write('  dpd.' + jsName + '.exec("' + name + '", path, body, fn);\n');
                                    res.write('}\n');
                                });
                            }

                            res.write('\n');
                        };

                        load(function (dpdJs) {

                            ctx.res.setHeader('Content-Type', 'text/javascript');

                            ctx.res.write(dpdJs);
                            generate(ctx.res, function () {
                                ctx.res.end();
                            });

                        });
                    }
                    catch (err) {
                        logger.error(ctx.req.method, ctx.req.url, err);
                        ctx.error(500, err, 'application/text');
                    }
                }
            }
            else {
                next();
            }
        }

    };

};

module.exports = DpdRouter;