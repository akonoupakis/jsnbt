var dpdSync = require('dpd-sync');
var auth = requireApp('auth.js');

var self = this;

var processFn = function () {
    if (!internal && !auth.isAuthorized(me, 'texts', 'C'))
        cancel('access denied', 500);

    var matched = dpdSync.call(dpd.texts.get, { key: self.key });
    if (matched.length > 0)
        cancel('text key already exists', 400);

    if (!internal)
        emit('textCreated', self);
};

dpdSync.wrap(processFn);