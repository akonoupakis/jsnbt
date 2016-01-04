module.exports = function (sender, context, data) {

    if (data.default)
        return context.error("the language is default and cannot be deleted");

    context.done();

};