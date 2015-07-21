var _ = require('underscore');

var PostParser = function (server, ctx) {
    
    return {

        process: function (postparsingContext, callback) {

            var moduleFns = [];

            _.each(server.app.modules.all, function (module) {
                if (_.isObject(module.view) && _.isFunction(module.view.postparse))
                    moduleFns.push(module.view.postparse);
            });

            var processModule = function () {

                var moduleFn = moduleFns.shift();
                if (moduleFn) {
                    moduleFn(server, ctx, postparsingContext, function (postparsedContext) {
                        processModule();
                    });
                }
                else {
                    callback(postparsingContext);
                }

            };

            processModule();

        }

    }

};

module.exports = PostParser;