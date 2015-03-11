var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'texts', 'U'))
    cancel('access denied', 500);

if (changed('key')) {
    dpd.texts.get({
        group: self.group,
        key: self.key,
        id: { $nin: [self.id] }
    }, function (matched, matchedError) {
        if (matchedError)
            throw matchedError;
        else
            if (matched.length > 0)
                cancel('combination of group and key already exists', 400);
    });
}

if (!internal)
    emit('textUpdated', self);