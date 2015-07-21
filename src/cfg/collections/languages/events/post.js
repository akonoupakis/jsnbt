var self = this;

db.languages.get({ code: self.code }, function (matchedError, matched) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('language code already exists', 400);
});