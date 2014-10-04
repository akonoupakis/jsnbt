var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var self = this;

var processFn = function () {
    if (!user.isAuthorized(me, 'languages', 'U'))
        cancel('access denied', 500);

    var matchedLanguages = dpdSync.call(dpd.languages.get, { code: self.code, id: { $nin: [self.id] } });
    if (matchedLanguages.length > 0)
        cancel('laguage code already exists', 400);

    emit('languageUpdated', self);
};

dpdSync.wrap(processFn);