module.exports = function (sender, context, data) {

    context.store.get(function (x) {
        x.query({
            layout: data.layout
        });
        x.single();
    }, function (matchedError, matched) {
        if (matchedError)
            return context.error(matchedError);

        if (matched)
            return context.error(400, 'layout already exists');

        context.done();
    });

};