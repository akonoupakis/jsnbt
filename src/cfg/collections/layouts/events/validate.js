var _ = require('underscore');

module.exports = function (sender, context, data) {
    
    var languageProperties = {};
    var contentProperties = {};

    if (sender.server.app.localization.enabled) {

        _.each(sender.server.app.languages, function (lang) {
            languageProperties[lang] = {
                type: "object"
            }
        });

        contentProperties = {
            localized: {
                type: "object",
                properties: languageProperties
            }
        };
    }

    var errors = context.validate({
        type: 'object',
        properties: {
            layout: {
                type: 'string',
                required: true,
                enum: _.pluck(sender.server.app.config.layouts, 'id')
            },
            content: {
                type: "object",
                required: true,
                properties: contentProperties
            }
        }
    });

    if (errors)
        return context.error(errors);

    context.done();

};