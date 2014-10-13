var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

var knownLanguageCodes = _.pluck(jsnbt.languages, 'code');

var knownEntity = _.first(_.filter(jsnbt.entities, function (x) { return x.name === self.entity; }));
if (!knownEntity) {
    error('entity', 'not a known entity');
}

if (self.localization.enabled === true) {
    if (knownEntity.localized !== true) {
        error('localization.enabled', 'node cannot be localized');
    }
    else {
        for (var lang in self.data.localized) {
            if (knownLanguageCodes.indexOf(lang) === -1)
                error('data.localized[' + lang + ']', lang + ' not a known language');
        }
    }
}
else {
    if (knownEntity.localized !== false) {
        error('localization.enabled', 'list should be localized');
    }
    else {
        if (knownLanguageCodes.indexOf(self.localization.language) === -1)
            error('localization.language', self.localization.language + ' not a known language');
    }
}

var validSeoNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.split('');
for (var lang in self.data.localized) {
    var currentChars = (self.data.localized[lang].seoName || '').split('');
    _.each(currentChars, function (char) {
        if (validSeoNameChars.indexOf(char) === -1)
            error('data.localized[' + lang + '].seoName', 'seo name invalid characters');
    });
}