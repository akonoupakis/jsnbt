var self = this;

dpd.texts.get({
    group: self.group,
    key: self.key
}, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('combination of group and key already exists', 400);
});