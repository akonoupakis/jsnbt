var self = this;

if (changed('code')) {
    db.languages.get({ code: self.code, id: { $nin: [self.id] } }, function (matchedError, matched) {
        if (matchedError)
            throw matchedError;
        else
            if (matched.length > 0)
                cancel('language code already exists', 400);
    });
}

if (changed('active')) {
    if(!self.active && self.default)
        error('active', 'cannot inactivate while default');
}

if (changed('default')) {
    if (!self.default) {

        db.languages.get({ active: true, 'default': true, id: { $nin: [self.id] } }, function (defaultsError, defaults) {
            if (defaultsError)
                throw defaultsError;
            else
                if (defaults.length === 0)
                    error('default', 'cannot set to false as there are no other active default languages');
        });
    }
}