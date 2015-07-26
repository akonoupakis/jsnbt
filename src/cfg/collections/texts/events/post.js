var self = this;

db.texts.get({
    group: self.group,
    key: self.key
}, function (matchedError, matched) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('combination of group and key already exists', 400);
});