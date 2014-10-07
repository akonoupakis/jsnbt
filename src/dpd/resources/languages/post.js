var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var self = this;

var processFn = function () {
    if (!internal && !user.isAuthorized(me, 'languages', 'C'))
        cancel('access denied', 500);

    var matched = dpdSync.call(dpd.languages.get, { code: self.code });
    if(matched.length > 0)
        cancel('language code already exists', 400);

    if (!internal)
        emit('languageCreated', self);
};

dpdSync.wrap(processFn);