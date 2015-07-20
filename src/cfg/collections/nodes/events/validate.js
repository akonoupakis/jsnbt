var _ = require('underscore');

var self = this;

var self = this;

var languageProperties = {};
var languageStringProperties = {};
var languageBooleanProperties = {};
var contentProperties = {};

if (server.app.localization.enabled) {

    _.each(server.app.languages, function (lang) {
        languageProperties[lang] = {
            type: "object"
        };

        languageStringProperties[lang] = {
            type: "string",
            required: false
        };

        languageBooleanProperties[lang] = {
            type: "boolean",
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
    languageBooleanProperties = { en: { type: "boolean", required: false } };
}

validate({
    type: 'object',
    properties: {
        domain: {
            type: 'string',
            enum: _.pluck(server.app.modules, 'domain')
        },
        entity: {
            type: 'string',
            enum: _.pluck(server.app.config.entities, 'name')
        },
        template: {
            type: 'string',
            enum: _.pluck(server.app.config.templates, 'id')
        },
        pointer: {
            type: 'object',
            properties: {
                domain: {
                    type: 'string',
                    enum: _.union(_.pluck(_.filter(server.app.modules, function (x) { return x.pointed; }), 'domain'), [''])
                }
            }
        },
        route: {
            type: 'string',
            enum: _.pluck(server.app.config.routes, 'id')
        },
        layout: {
            type: 'object',
            properties: {
                value: {
                    type: 'string',
                    enum: _.union(_.pluck(server.app.config.layouts, 'id'), [''])
                }
            }
        },
        content: {
            type: "object",
            required: true,
            properties: contentProperties
        },
        seo: {
            type: "object",
            required: true,
            properties: languageStringProperties
        },
        active: {
            type: "object",
            required: true,
            properties: languageBooleanProperties
        },
        meta: {
            type: "object",
            required: true,
            properties: languageProperties
        },
        roles: {
            type: 'object',
            properties: {
                value: {
                    type: 'array',
                    enum: _.pluck(server.app.config.roles, 'name')
                }
            }
        }
    }
});

var entity = requireApp('cms/entityMngr.js')(server, self.entity);

if (entity.hasProperty('seo')) {
    var validSeoNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.split('');
    for (var lang in self.seo) {
        var currentChars = (self.seo[lang] || '').split('');
        _.each(currentChars, function (char) {
            if (validSeoNameChars.indexOf(char) === -1)
                error('seo[' + lang + ']', 'seo name invalid characters');
        });
    }
}