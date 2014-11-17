var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'layouts', 'C'))
    cancel('access denied', 500);

dpd.layouts.get({
    layout: self.layout
}, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('layout already exists', 400);
});

if (!internal)
    emit('layoutCreated', self);