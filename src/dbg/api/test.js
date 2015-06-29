module.exports = function(server) {

    return {

        test: function (ctx, fields) {
            ctx.json({ test: 'test' });
        }

    }
}