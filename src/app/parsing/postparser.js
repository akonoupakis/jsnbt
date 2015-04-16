var app = require('../app.js');
var _ = require('underscore');

var PostParser = function (server, ctx) {
    
    return {

        process: function (postparsingContext) {
            _.each(app.modules.all, function (module) {
                if (_.isObject(module.view) && _.isFunction(module.view.postparse))
                    module.view.postparse(server, ctx, postparsingContext);
            });
        }

    }

};

module.exports = PostParser;