var AuthApi = function (server) {

    this.server = server;

};

AuthApi.prototype.create = function (ctx, fields) {
    ctx.error(500, 'not implemented');
};

AuthApi.prototype.login = function (ctx, fields) {
    var store = this.server.db.createStore('users', ctx.req, ctx.res, true);

    store.get(function (x) {
        x.query({ username: fields.username });
        x.single();
    }, function (err, user) {
        if (err) {
            if (err.code && err.messages)
                ctx.error(err.code, err.messages);
            else
                ctx.error(500, err);
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
                ctx.error(401, 'Access Denied');
            }
        }
    });
};

AuthApi.prototype.logout = function (ctx, fields) {
    delete ctx.req.session.uid;
    delete ctx.req.session.user;
    ctx.req.session.save();

    ctx.send({
        logout: true
    });
};

AuthApi.prototype.passwd = function (ctx, fields) {

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
};

AuthApi.prototype.requestEmailChange = function (ctx, fields) {
    var authMngr = require('../cms/authMngr.js')(this.server);
    authMngr.requestEmailConfirmationCode(ctx.session.user, fields.email, function (err, res) {
        if (err) 
            return ctx.error(500, err);
        
        ctx.json(res);
    });
};

AuthApi.prototype.submitEmailChange = function (ctx, fields) {
    var authMngr = require('../cms/authMngr.js')(this.server);
    authMngr.submitEmailConfirmationCode(ctx.session.user, fields.code, function (err, res) {
        if (err) 
            return ctx.error(500, err);
        
        ctx.json(res);
    });
}

AuthApi.prototype.forgotPassword = function (ctx, fields) {
    ctx.error(500, 'not implemented');
};

AuthApi.prototype.resetPassword = function (ctx, fields) {
    ctx.error(500, 'not implemented');
};

module.exports = function (server) {
    return new AuthApi(server);
};