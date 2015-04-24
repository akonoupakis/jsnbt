var self = this;

dpd.languages.get({ code: self.code }, function (matched, matchedError) {
    if (matchedError)
        throw matchedError;
    else
        if (matched.length > 0)
            cancel('language code already exists', 400);
});