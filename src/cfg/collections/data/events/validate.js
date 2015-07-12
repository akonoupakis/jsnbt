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
        content: {
            type: "object",
            required: true,
            properties: contentProperties
        }
    }
});
