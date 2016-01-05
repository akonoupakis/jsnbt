var _ = require('underscore');

module.exports = function (sender, context, data) {

    var errors = context.validate({
        type: 'object',
        properties: {
            collection: {
                type: "string",
                required: true,
                enum: _.keys(sender.server.app.config.collections)
            }
        }
    });
     
    if (errors)
        return context.error(errors);

    context.done();

};