var _ = require('underscore');

var self = this;

var languageProperties = {};
var contentProperties = {};

if (server.jsnbt.localization) {

    _.each(server.jsnbt.languages, function (lang) {
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
            enum: _.pluck(server.jsnbt.layouts, 'id')
        },
        content: {
            type: "object",
            required: true,
            properties: contentProperties
        }
    }
});