var _ = require('underscore');

module.exports = function (sender, context, data) {

    var languageProperties = {};
    var languageStringProperties = {};
    var languageBooleanProperties = {};
    var contentProperties = {};

    if (sender.server.app.localization.enabled) {

        _.each(sender.server.app.languages, function (lang) {
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

    var errors = context.validate({
        type: 'object',
        properties: {
            title: {
                type: "object",
                required: true,
                properties: languageStringProperties
            },
            domain: {
                type: 'string',
                enum: _.pluck(sender.server.app.modules.all, 'domain')
            },
            entity: {
                type: 'string',
                enum: _.pluck(sender.server.app.config.entities, 'name')
            },
            template: {
                type: 'string',
                enum: _.pluck(sender.server.app.config.templates, 'id')
            },
            pointer: {
                type: 'object',
                properties: {
                    domain: {
                        type: 'string',
                        enum: _.union(_.pluck(_.filter(sender.server.app.modules.all, function (x) { return x.pointed; }), 'domain'), [''])
                    }
                }
            },
            route: {
                type: 'string',
                enum: _.pluck(sender.server.app.config.routes, 'id')
            },
            layouts: {
                type: 'object',
                properties: {
                    value: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        enum: _.union(_.pluck(sender.server.app.config.layouts, 'id'), [''])
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
                        enum: _.pluck(sender.server.app.config.roles, 'name')
                    }
                }
            }
        }
    });

    if (errors)
        return context.error(errors);

    var nodeMngr = sender.server.require('./cms/nodeMngr.js')(sender.server);
    var entity = nodeMngr.getEntity(data.entity);

    if (entity.hasProperty('seo')) {
        var validSeoNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.split('');
        for (var lang in data.seo) {
            var currentChars = (data.seo[lang] || '').split('');
            _.each(currentChars, function (char) {
                if (validSeoNameChars.indexOf(char) === -1)
                    return context.error(400, 'seo[' + lang + ']: ' + 'seo name invalid characters');
            });
        }
    }

    context.done();

};