var self = this;

if (changed('key')) {
    db.texts.get({
        group: self.group,
        key: self.key,
        id: { $nin: [self.id] }
    }, function (matchedError, matched) {
        if (matchedError)
            throw matchedError;
        else
            if (matched.length > 0)
                cancel('combination of group and key already exists', 400);
    });
}