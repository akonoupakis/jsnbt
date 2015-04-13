var app = null;

module.exports = {

    init: function (application) {
        app = application;

        //var cacheKey1 = 'node.alpha';
        //var cacheKey2 = 'node.vita';


        //app.cache.add(cacheKey1, 'cacheKey1Value', function (cacheKey1Response) {
        //    console.log('cacheKey1added', cacheKey1Response);

        //    app.cache.add(cacheKey2, 'cacheKey2Value', function (cacheKey2Response) {
        //        console.log('cacheKey2added', cacheKey2Response);


        //        app.cache.get(cacheKey1, function (cacheKey1GotResponse) {
        //            console.log('cacheKey1got', cacheKey1GotResponse);

        //            app.cache.get(cacheKey2, function (cacheKey2GotResponse) {
        //                console.log('cacheKey2got', cacheKey2GotResponse);

        //                app.cache.purge('node', function (purgeResponse) {

        //                    console.log('purged');

        //                    app.cache.get(cacheKey1, function (cacheKey1Got2Response) {
        //                        console.log('cacheKey1got', cacheKey1Got2Response);

        //                        app.cache.get(cacheKey2, function (cacheKey2Got2Response) {
        //                            console.log('cacheKey2got', cacheKey2Got2Response);
        //                        });

        //                    });

        //                });

        //            });

        //        });

        //    });

        //});

    },

    getConfig: function () {
        return require('./config.js');
    },

    getBower: function () {
        return require('./bower.json');
    },

    route: function (ctx, next) {
        if (ctx.uri.path == '/test') {
            ctx.dpd.settings.getCached({}, function (res, err) {
                if (err) {
                    ctx.error(500, err);
                }
                else {
                    ctx.json(res);
                }
            });
        }
        else {
            next();
        }
    },

    routeSearch: function (ctx, next) {

        var notimp = true;

        if (notimp) {
            ctx.error(500, 'not implemented');
        }
        else {
            next();
        }

    },

    routeApi: function (ctx, serviceName, fnName, fields, files, next) {

        var service = null;
        try {
            service = require('./api/' + serviceName + '.js');
        }
        catch (e) { }

        if (service && typeof (service[fnName]) === 'function') {
            service[fnName](ctx, fields);
        }
        else {
            next();
        }

    },

    view: {

        preparse: function (ctx, preparsingContext) {
            // change here the preparsingContext.model and the preparsingContext.tmpl before rendering
        },

        postparse: function (ctx, postparsingContext) {
            // change here the postparsingContext.html upon render
        }

    }
}