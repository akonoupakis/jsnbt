var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'languages', 'C'))
    cancel('access denied', 500);

dpd.languages.get({ code: self.code }, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('language code already exists', 400);
});

if (!internal)
    emit('languageCreated', self);