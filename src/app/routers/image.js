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
                                if (ctx.uri.query.type === 'custom') {
                                    if (!ctx.uri.query.processors) {
                                        ctx.error(400);
                                    }
                                    else {
                                        var parsedProcessors = JSON.parse(decodeURIComponent(ctx.uri.query.processors));
                                        if (parsedProcessors) {
                                            renderImage(ctx, filePath, parsedProcessors);
                                        }
                                        else {
                                            ctx.error(500);
                                        }
                                    }
                                }
                                else {
                                    var imageType = _.first(_.filter(jsnbt.images, function (x) { return x.name === ctx.uri.query.type; }));
                                    if (!imageType) {
                                        ctx.error(404);
                                    }
                                    else {
                                        renderImage(ctx, filePath, imageType.processors);
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

var renderImage = function (ctx, src, gen) {

    try {
        var fileKey = md5(JSON.stringify({
            src: src,
            gen: gen
        }));

        var fileExt = path.extname(src);

        var targetFilePath = server.getPath(app.root + '/public' + src);
        var destFilePath = server.getPath(app.root + '/public/tmp/' + fileKey + fileExt);
        
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

                var cropProcessors = [];

                var nextIndex = 0;
                var next = function () {
                    nextIndex++;
                    var processor = cropProcessors[nextIndex];
                    processor.process(ctx, next);
                   
                };

                _.each(gen, function (processor) {

                    cropProcessors.push({
                        process: function (ctxInternal, nextInternal) {

                            var options = {};
                        
                            var fnName = undefined;
                            if (processor.type === 'crop') {
                                options.x = processor.options.x;
                                options.y = processor.options.y;
                                options.cropwidth = processor.options.width;
                                options.cropheight = processor.options.height;
                                options.gravity = 'NorthWest';

                                fnName = 'crop';
                            }
                            else if (processor.type === 'thumb') {
                                options.width = processor.options.width;
                                options.height = processor.options.height;
                                options.x = 0;
                                options.y = 0;
                                options.cropwidth = processor.options.width;
                                options.cropheight = processor.options.height;
                                options.gravity = 'Center';
                                options.fill = true;

                                fnName = 'rescrop';
                            }
                            else if (processor.type === 'resize') {
                                options.width = processor.options.width;
                                options.height = processor.options.height;

                                fnName = 'resize';
                            }

                            if (fnName) {
                                options.src = targetFilePath;
                                options.dst = destFilePath;

                                if (ctxInternal.imageObj) {
                                    options.src = destFilePath;
                                    options.dst = destFilePath;
                                }

                                easyimg[fnName](options).then(function (image) {
                                    ctxInternal.imageObj = image;
                                    ctxInternal.imageDst = destFilePath;

                                    nextInternal();
                                }, function (err) {
                                    ctxInternal.error(500, err);
                                });
                            }
                            else {
                                nextInternal();
                            }
                        }
                    });

                });

                cropProcessors.push({
                    process: function (ctxInternal) { 
                        fs.readFile(destFilePath, function (readErr, img) {
                            if (readErr) {
                                ctx.error(500, readErr);
                            }
                            else {
                                ctx.res.writeHead(200, { 'Content-Type': 'image/' + ctxInternal.imageObj.type.toLowerCase() });
                                ctx.res.write(img);
                                ctx.res.end();
                            }
                        });
                    }
                });

                var first = _.first(cropProcessors);
                first.process(ctx, next);
            }
        });
    }
    catch (err) {
        app.logger.error(err);
        ctx.error(500, err);
    }

};