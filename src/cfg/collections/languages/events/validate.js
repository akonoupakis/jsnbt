var _ = require('underscore');

module.exports = function (sender, context, data) {
    
    var errors = context.validate({
        type: 'object',
        properties: {
            code: {
                type: "string",
                required: true,
                enum: _.pluck(sender.server.app.languages, 'code')
            }
        }
    });

    if (errors)
        return context.error(errors);

    context.done();

};