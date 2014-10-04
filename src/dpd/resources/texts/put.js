var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var self = this;

var processFn = function () {
    if (!user.isAuthorized(me, 'texts', 'U'))
        cancel('access denied', 500);

    var matched = dpdSync.call(dpd.texts.get, { key: self.key, id: { $nin: [self.id] } });
    if (matched.length > 0)
        cancel('text key already exists', 400);

    emit('textUpdated', self);
};

dpdSync.wrap(processFn);