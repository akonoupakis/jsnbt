module.exports = function(server) {

    return {

        place: function (ctx, next) {

            var serviceName = 'place';
            var fnName = 'nearbysearch';
            var options = {
                location: '-33.8670522,151.1957362',
                radius: '500',
                types: 'food',
                name: 'cruise'
            };

            var gApi = require('jsnbt-google-api');

            gApi.callApi(server, ctx, serviceName, fnName, options, function (err, data) {
                if (err)
                    ctx.error(500, err);
                else {
                    ctx.write(data);
                    ctx.end();
                }
            });

            
        }

    }
}