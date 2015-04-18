var _ = require('underscore');

var PreParser = function (server, ctx) {
    
    return {

        process: function (preparsingContext) {
            _.each(server.app.modules.all, function (module) {
                if (_.isObject(module.view) && _.isFunction(module.view.preparse))
                    module.view.preparse(server, ctx, preparsingContext);
            });
        }

    }

};

module.exports = PreParser;