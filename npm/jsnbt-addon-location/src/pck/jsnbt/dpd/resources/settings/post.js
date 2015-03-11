var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'settings', 'C'))
    cancel('access denied', 500);

dpd.settings.get({
    domain: self.domain
}, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('setting already exists', 400);
});

if (!internal)
    emit('settingCreated', self);