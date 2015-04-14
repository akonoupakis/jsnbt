var self = this;

dpd.settings.get({
    domain: self.domain,
    id: { $nin: [self.id] }
}, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('setting already exists', 400);
});
