var UserApi = function (server) {

    var authMngr = require('../cms/authMngr.js')(server);

    return {

        passwd: function (ctx, fields) {
            console.log(123);
            //
            var store = server.db.createStore('nodes');
            //store.find({
                
            //}, function (err, result) {
            //    if (err)
            //        ctx.error(err);
            //    else
            //        ctx.json(result);

            //});

            
            

            store.exec(function (x) {
                x.find({})
                .findOne({})
                .count()
                

                .fields(['domain', 'entity', 'title.en'])
                .fields({
                    'domain': 1,
                    'entity': 1,
                    'title.en': 1
                })

                .sort({ 'title.en': 1 })
                .skip(1)
                .limit(5)

                
            }, function (err, results) {
                if (err)
                    throw err;
                else
                    console.log(response);
            });

            //ctx.db.users.get({
            //    '$limit': 1
            //}, function (err, result) {
            //    if (err)
            //        ctx.error(err);
            //    else
            //        ctx.json(result);

            //});

        },

        remail: function (ctx, fields) {
            authMngr.requestEmailConfirmationCode(ctx, ctx.session.user, fields.email, function (err, res) {
                if (err) {
                    ctx.json(null);
                }
                else {
                    ctx.json(res);
                }
            });
        },

        semail: function (ctx, fields) {
            authMngr.submitEmailConfirmationCode(ctx, ctx.session.user, fields.code, function (err, res) {
                if (err) {
                    ctx.json(null);
                }
                else {
                    ctx.json(res);
                }
            });
        }

    };

};

module.exports = UserApi;