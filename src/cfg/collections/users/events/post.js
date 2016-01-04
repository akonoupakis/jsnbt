module.exports = function (sender, context, data) {

    if (!context.internal)
        context.error(401, 'access denied');

    context.done();

};