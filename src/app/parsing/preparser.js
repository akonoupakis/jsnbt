var _ = require('underscore');

var PreParser = function (server, ctx) {
    
    return {

        process: function (preparsingContext, callback) {

            var moduleFns = [];

            _.each(server.app.modules.all, function (module) {
                if (_.isObject(module.view) && _.isFunction(module.view.preparse)) {
                    moduleFns.push(module.view.preparse);
                }
            });

            var processModule = function () {

                var moduleFn = moduleFns.shift();
                if (moduleFn) {
                    moduleFn(server, ctx, preparsingContext, function (preparsedContext) {
                        processModule();
                    });
                }
                else {
                    callback(preparsingContext);
                }

            };

            processModule();
        }

    }

};

module.exports = PreParser;