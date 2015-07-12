var _ = require('underscore');

var self = this;

var languageProperties = {};
var contentProperties = {};

if (server.app.localization.enabled) {

    _.each(server.languages, function (lang) {
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

validate({
    type: 'object',
    properties: {
        layout: {
            type: 'string',
            required: true,
            enum: _.pluck(server.app.config.layouts, 'id')
        },
        content: {
            type: "object",
            required: true,
            properties: contentProperties
        }
    }
});