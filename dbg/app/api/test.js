module.exports = function(server) {

    return {

        test: function (ctx, fields) {
            //ctx.json({ test: 'test' });

            ctx.json(['test1', 'test2']);
        }

    }
}