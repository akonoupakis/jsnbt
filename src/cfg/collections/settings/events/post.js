var self = this;

db.settings.get({
    domain: self.domain
}, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('setting already exists', 400);
});