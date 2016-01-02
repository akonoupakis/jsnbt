var _ = require('underscore');

module.exports = function (sender, context, data) {

    var languageProperties = {};
    var languageStringProperties = {};
    var contentProperties = {};

    if (sender.server.app.localization.enabled) {

        _.each(sender.server.app.languages, function (lang) {
            languageProperties[lang] = {
                type: "object"
            }

            languageStringProperties[lang] = {
                type: "string",
                required: false
            };
        });

        contentProperties = {
            localized: {
                type: "object",
                properties: languageProperties
            }
        };
    }
    else {
        languageStringProperties = { en: { type: "string", required: false } };
    }

    var errors = context.validate({
        type: 'object',
        properties: {
            domain: {
                type: "string",
                required: true,
                enum: _.pluck(_.uniq(sender.server.app.config.lists, function (x) { return x.domain; }), 'domain')
            },
            list: {
                type: "string",
                required: true,
                enum: _.pluck(_.filter(sender.server.app.config.lists, function (x) { return x.domain === data.domain; }), 'id')
            },
            title: {
                type: "object",
                required: true,
                properties: languageStringProperties
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