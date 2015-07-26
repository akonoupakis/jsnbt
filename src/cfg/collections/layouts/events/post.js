var self = this;

db.layouts.get({
    layout: self.layout
}, function (matchedError, matched) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('layout already exists', 400);
});