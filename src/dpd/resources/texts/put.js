var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var self = this;

var processFn = function () {
    if (!internal && !user.isAuthorized(me, 'texts', 'U'))
        cancel('access denied', 500);

    if (changed('key')) {
        var matched = dpdSync.call(dpd.texts.get, { key: self.key, id: { $nin: [self.id] } });
        if (matched.length > 0)
            cancel('text key already exists', 400);
    }

    if (!internal)
        emit('textUpdated', self);
};

dpdSync.wrap(processFn);