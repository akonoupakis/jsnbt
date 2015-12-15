module.exports = function(server) {

    return {

        print: function (ctx, next) {
            ctx.json(ctx.timer.get());
        }

    }
}