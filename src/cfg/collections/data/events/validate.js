var _ = require('underscore');

var self = this;

var languageProperties = {};
var languageStringProperties = {};
var contentProperties = {};

if (server.app.localization.enabled) {

    _.each(server.app.languages, function (lang) {
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

validate({
    type: 'object',
    properties: {
        domain: {
            type: "string",
            required: true,
            enum: _.pluck(_.uniq(server.app.config.lists, function (x) { return x.domain; }), 'domain')
        },
        list: {
            type: "string",
            required: true,
            enum: _.pluck(_.filter(server.app.config.lists, function (x) { return x.domain === self.domain; }), 'id')
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
