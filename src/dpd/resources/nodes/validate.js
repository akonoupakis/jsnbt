var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

var knownLanguageCodes = _.pluck(jsnbt.languages, 'code');

var entity = requireApp('entity.js')(self.entity);

if (!entity) {
    error('entity', 'not a known entity');
}

if (entity.isLocalized()) {
    if (self.data.localized) {
        for (var lang in self.data.localized) {
            if (knownLanguageCodes.indexOf(lang) === -1)
                error('data.localized[' + lang + ']', lang + ' not a known language');
        }
    }
}

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