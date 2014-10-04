var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var self = this;

var processFn = function () {
    if (!user.isAuthorized(me, 'languages', 'C'))
        cancel('access denied', 500);

    var matchedLanguages = dpdSync.call(dpd.languages.get, { code: self.code });
    if(matchedLanguages.length > 0)
        cancel('laguage code already exists', 400);

    emit('languageCreated', self);
};

dpdSync.wrap(processFn);