var self = this;

dpd.layouts.get({
    layout: self.layout,
    id: { $nin: [self.id] }
}, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('layout already exists', 400);
});