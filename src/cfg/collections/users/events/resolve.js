module.exports = function (sender, context, data) {

    if (!context.internal) {
        context.hide('password');
    }

    context.done();

};