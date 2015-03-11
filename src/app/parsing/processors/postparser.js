var app = require('../../app.js');
var _ = require('underscore');

module.exports = function (ctx) {
    
    return {

        process: function (postparsingContext)
        {
            _.each(app.modules, function (module) {
                if (_.isObject(module.view) && _.isFunction(module.view.postparse))
                    module.view.postparse(postparsingContext);
            });
        }

    }

};