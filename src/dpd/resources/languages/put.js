var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var self = this;

var processFn = function () {
    if (!internal && !user.isAuthorized(me, 'languages', 'U'))
        cancel('access denied', 500);

    if (changed('code')) {
        var matched = dpdSync.call(dpd.languages.get, { code: self.code, id: { $nin: [self.id] } });
        if (matched.length > 0)
            cancel('language code already exists', 400);
    }

    if (changed('active')) {
        if(!self.active && self.default)
            error('active', 'cannot inactivate while default');
    }

    if (changed('default')) {
        if (!self.default) {
            var defaults = dpdSync.call(dpd.languages.get, { active: true, 'default': true, id: { $nin: [self.id] } });
            if (defaults.length === 0)
                error('default', 'cannot set to false as there are no other active default languages');
        }
    }

    if (!internal)
        emit('languageUpdated', self);
};

dpdSync.wrap(processFn);