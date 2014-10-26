var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'texts', 'C'))
    cancel('access denied', 500);

dpd.texts.get({ key: self.key }, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('text key already exists', 400);
});

if (!internal)
    emit('textCreated', self);