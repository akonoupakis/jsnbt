module.exports = function(server) {

    return {

        test: function (ctx, next) {
            ctx.json({ test: 'test' });
        }

    }
}