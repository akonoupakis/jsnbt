var self = this;

if (changed('key')) {
    db.texts.get({
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