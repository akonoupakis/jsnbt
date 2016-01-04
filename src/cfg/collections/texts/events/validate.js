var _ = require('underscore');

module.exports = function (sender, context, data) {

    var languageProperties = {};

    if (sender.server.app.localization.enabled) {

        _.each(sender.server.app.languages, function (lang) {
            languageProperties[lang] = {
                type: "string"
            }
        });

    }
    else {
        languageProperties.en = {
            type: "string"
        }
    }

    var errors = context.validate({
        type: 'object',
        properties: {
            value: {
                type: "object",
                required: true,
                properties: languageProperties
            }
        }
    });

    if (errors)
        return context.error(errors);

    var keyValidChars = 'abcdefghijklmnopqrstuvwxyz0123456789_.'.split('');

    var currentChars = (data.key || '').split('');
    _.each(currentChars, function (char) {
        if (keyValidChars.indexOf(char) === -1)
            return context.error(400, 'key invalid characters');
    });
    
    var groupValidChars = 'abcdefghijklmnopqrstuvwxyz_'.split('');

    var currentGroupChars = (data.group || '').split('');
    _.each(currentGroupChars, function (char) {
        if (groupValidChars.indexOf(char) === -1)
            return context.error(400, 'group invalid characters');
    });

    context.done();
};