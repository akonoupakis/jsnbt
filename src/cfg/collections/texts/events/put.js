module.exports = function (sender, context, data) {

    if (context.changed('key')) {
        context.store.get(function(x) {
            x.query({
                group: data.group,
                key: data.key,
                id: { $nin: [data.id] }
            });
            x.single();
        }, function (matchedError, matched) {
            if (matchedError)
                return context.error(matchedError);
            else
                if (matched)
                    return context.error(400, 'combination of group and key already exists');

            context.done();
        });
    }
    else {
        context.done();
    }

};