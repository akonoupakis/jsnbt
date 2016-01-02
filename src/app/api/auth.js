var UserApi = function (server) {

    var authMngr = require('../cms/authMngr.js')(server);

    return {

        create: function (ctx, fields) {

        },

        login: function (ctx, fields) {
            var store = server.db.createStore('users', ctx.req, ctx.res, true);

            store.get(function (x) {
                x.query({ username: fields.username });
                x.single();
            }, function (err, user) {
                if (err) {
                    if (err.code && err.messages)
                        ctx.status(err.code).send(err.messages);
                    else
                        ctx.status(500).send(err);
                }
                else {
                    if (user) {
                        ctx.req.session.uid = user.id;
                        delete user.password;
                        ctx.req.session.user = user;
                        ctx.req.session.save(function () { 
                            ctx.send(user);
                        });
                    }
                    else {
                        ctx.status(401).send('Access Denied');
                    }
                }
            });
        },

        logout: function (ctx, fields) {
            delete ctx.req.session.uid;
            delete ctx.req.session.user;
            ctx.req.session.save();

            ctx.send({
                logout: true
            });
        },

        passwd: function (ctx, fields) {

            /*
            
               uc.store.first({ id: ctx.session.user.id }, function (err, user) {
              if (err) return ctx.done(err);

              if (user) {
                  var salt = user.password.substr(0, SALT_LEN)
                    , hash = user.password.substr(SALT_LEN);

                  if (hash === uc.hash(credentials.password, salt)) {
                      var newSalt = db.uuid.create(SALT_LEN);
                      var newPassword = newSalt + uc.hash(credentials.newPassword, newSalt);
                      uc.store.update({ id: ctx.session.user.id }, {
                          password: newPassword
                      }, function (err) {
                          if (err) {
                              throw err;
                              ctx.res.statusCode = 500;
                          }

                          ctx.done(err);
                      });

                      return;
                  }
                  else {
                      ctx.res.statusCode = 401;
                      ctx.done('bad credentials');
                  }
              }
              else {
                  ctx.res.statusCode = 400;
                  ctx.done('bad request');
              }
            
            */

            ctx.json({});
        },

        forgot: function (ctx, fields) {
            authMngr.requestEmailConfirmationCode(ctx, ctx.session.user, fields.email, function (err, res) {
                if (err) {
                    ctx.json(null);
                }
                else {
                    ctx.json(res);
                }
            });
        },

        reset: function (ctx, fields) {
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