var _ = require('underscore');

module.exports = function (sender, context, data) {

    var errors = context.validate({
        type: 'object',
        properties: {
            roles: {
                type: "array",
                required: true,
                items: { type: "string" },
                enum: _.pluck(sender.server.app.config.roles, 'name'),
                uniqueItems: true
            }
        }
    });

    if (errors)
        return context.error(errors);

    if (!data.username.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i)) 
        return context.error(400, 'username is not a valid email');
    
    context.done();

};