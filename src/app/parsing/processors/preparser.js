var app = require('../../app.js');
var _ = require('underscore');

module.exports = function (ctx) {
    
    return {

        process: function (preparsingContext)
        {
            _.each(app.modules, function (module) {
                if (_.isObject(module.view) && _.isFunction(module.view.preparse))
                    module.view.preparse(ctx, preparsingContext);
            });
        }

    }

};