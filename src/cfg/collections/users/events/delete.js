module.exports = function (sender, context, data) {

    context.error(401, 'access denied');

};