module.exports = function() {

    return {

        print: function (ctx, next) {
            ctx.json(ctx.timer.get());
        }

    }
}