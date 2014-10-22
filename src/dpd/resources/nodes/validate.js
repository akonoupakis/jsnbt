var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

var knownLanguageCodes = _.pluck(jsnbt.languages, 'code');

var knownEntity = _.first(_.filter(jsnbt.entities, function (x) { return x.name === self.entity; }));
if (!knownEntity) {
    error('entity', 'not a known entity');
}

if (knownEntity.localized === undefined || knownEntity.localized === true) {
    if (self.data.localized) {
        for (var lang in self.data.localized) {
            if (knownLanguageCodes.indexOf(lang) === -1)
                error('data.localized[' + lang + ']', lang + ' not a known language');
        }
    }
}

var validSeoNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.split('');
for (var lang in self.url) {
    var currentChars = (self.url[lang] || '').split('');
    _.each(currentChars, function (char) {
        if (validSeoNameChars.indexOf(char) === -1)
            error('url[' + lang + ']', 'seo name invalid characters');
    });
}