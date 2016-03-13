var fs = require('fs');
var ImageTransformer = require('image-transform');
var _ = require('underscore');

var Router = function (server) {
    this.server = server;
    this.transformer = new ImageTransformer({
        tmp: server.mapPath('www/public/tmp/')
    });
};

Router.prototype.route = function (ctx, next) {
    var self = this;

    var filePath = decodeURIComponent(ctx.uri.path);

    if (filePath.length > 4) {
        var targetFilePath = self.server.mapPath('www/public' + filePath);

        fs.exists(targetFilePath, function (cbExists) {
            if (!cbExists) {
                ctx.error(404);
            }
            else {
                if (ctx.uri.query.type === 'custom') {
                    if (!ctx.uri.query.processors) {
                        next();
                    }
                    else {
                        var parsedProcessors = JSON.parse(decodeURIComponent(ctx.uri.query.processors));
                        if (parsedProcessors) {
                            self.transformer.transform(self.server.mapPath('www/public' + filePath), parsedProcessors, function (err, info, image) {
                                if (err)
                                    return ctx.error(500, err);

                                ctx.res.writeHead(200, { 'Content-Type': 'image/' + info.type.toLowerCase() });
                                ctx.res.write(image);
                                ctx.res.end();
                            });
                        }
                        else {
                            ctx.error(500);
                        }
                    }
                }
                else {
                    var imageType = _.find(self.server.app.config.images, function (x) { return x.name === ctx.uri.query.type; });
                    if (!imageType) {
                        next();
                    }
                    else {
                        self.transformer.transform(self.server.mapPath('www/public' + filePath), imageType.processors, function (err, info, image) {
                            if (err)
                                return ctx.error(500, err);

                            ctx.res.writeHead(200, { 'Content-Type': 'image/' + info.type.toLowerCase() });
                            ctx.res.write(image);
                            ctx.res.end();
                        });
                    }
                }
            }
        });
    }
    else {
        next();
    }
}

module.exports = function (server) {
    return new Router(server);
};