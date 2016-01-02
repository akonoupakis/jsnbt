module.exports = function (sender, context, data) {

    context.store.get(function (x) {
        x.query({
            domain: data.domain
        });
        x.single();
    }, function (matchedError, matched) {
        if (matchedError)
            return context.error(matchedError);
        else
            if (matched)
                return context.error(400, 'setting already exists');

        context.done();
    });

};