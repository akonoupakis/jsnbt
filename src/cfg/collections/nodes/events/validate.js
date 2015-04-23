var _ = require('underscore');

var self = this;

var knownLanguageCodes = _.pluck(server.jsnbt.languages, 'code');

var entity = requireApp('cms/entityMngr.js')(server, self.entity);

if (!entity) {
    error('entity', 'not a known entity');
}

if (entity.hasProperty('seo')) {
    for (var lang in self.seo) {
        if (knownLanguageCodes.indexOf(lang) === -1)
            error('seo[' + lang + ']', lang + ' not a known language');
    }

    var validSeoNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.split('');
    for (var lang in self.seo) {
        var currentChars = (self.seo[lang] || '').split('');
        _.each(currentChars, function (char) {
            if (validSeoNameChars.indexOf(char) === -1)
                error('seo[' + lang + ']', 'seo name invalid characters');
        });
    }
}