var app = require('../app.js');
var fs = require('../utils/fs.js');
var jsnbt = require('../jsnbt.js');
var server = require('server-root');
var easyimg = require('easyimage');
var md5 = require('MD5');
var path = require('path');
var extend = require('extend');

var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function () {

    return {
        route: function (ctx, next) {
            if (ctx.uri.first === 'files') {
                if (ctx.req.method !== 'GET') {
                    ctx.error(405);
                }
                else if (!ctx.uri.query.type) {
                    ctx.error(400);
                }
                else {

                    var filePath = ctx.uri.path;

                    if (filePath.length > 4) {
                        var targetFilePath = server.getPath(app.root + '/public' + filePath);

                        fs.exists(targetFilePath, function (cbExists) {
                            if (!cbExists) {
                                ctx.error(404);
                            }
                            else {
                                var imageType = _.first(_.filter(jsnbt.images, function (x) { return x.name === ctx.uri.query.type; }));
                                if (!imageType) {
                                    ctx.error(404);
                                }
                                else {
                                    try {
                                        var options = {};

                                        extend(true, options, imageType.options);

                                        var fileKey = md5(JSON.stringify({
                                            path: filePath,
                                            options: options
                                        }));

                                        var fileExt = path.extname(targetFilePath);
                                        var destFilePath = server.getPath('dev/public/tmp/' + fileKey + fileExt);

                                        extend(true, options, {
                                            src: targetFilePath,
                                            dst: destFilePath
                                        });

                                        fs.exists(destFilePath, function (cbExists) {
                                            if (cbExists) {
                                                easyimg.info(destFilePath).then(function (image) {
                                                    fs.readFile(destFilePath, function (readErr, img) {
                                                        if (readErr) {
                                                            ctx.error(500, readErr);
                                                        }
                                                        else {
                                                            ctx.res.writeHead(200, { 'Content-Type': 'image/' + image.type.toLowerCase() });
                                                            ctx.res.write(img);
                                                            ctx.res.end();
                                                        }
                                                    });
                                                }, function (err) {
                                                    ctx.error(500, err);
                                                });
                                            }
                                            else {
                                                easyimg.resize(options).then(function (image) {
                                                    fs.readFile(destFilePath, function (readErr, img) {
                                                        if (readErr) {
                                                            ctx.error(500, readErr);
                                                        }
                                                        else {
                                                            ctx.res.writeHead(200, { 'Content-Type': 'image/' + image.type.toLowerCase() });
                                                            ctx.res.write(img);
                                                            ctx.res.end();
                                                        }
                                                    });
                                                }, function (err) {
                                                    ctx.error(500, err);
                                                });
                                            }
                                        });
                                    }
                                    catch (err) {
                                        app.logger.error(err);
                                        ctx.error(500, err);
                                    }
                                }
                            }
                        });
                    }
                }
            }
            else {
                next();
            }
        }
    };

};