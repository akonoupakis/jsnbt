module.exports = function (sender, context, data) {

    if (!context.internal)
        return context.error(401, 'access denied');

    context.done();

};