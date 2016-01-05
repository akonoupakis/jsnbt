var validation = require('json-validation');
var _ = require('underscore');

var AuthApi = function (server) {

    this.server = server;

};

AuthApi.prototype.create = function (ctx, fields) {
    var self = this;

    var user = {
        username: fields.username,
        firstName: fields.firstName,
        lastName: fields.lastName,
        password: fields.password,
        roles: fields.roles
    };

    var validator = new validation.JSONValidation();
    var validationResult = validator.validate(user, {
        type: 'object',
        required: true,
        properties: {
            username: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            },
            firstName: {
                type: 'string',
                required: true
            },
            lastName: {
                type: 'string',
                required: true
            },
            roles: {
                type: 'array',
                required: true,
                items: {
                    type: 'string'
                },
                enum: _.pluck(self.server.app.config.roles, 'name'),
                uniqueItems: true
            }
        }
    });
    if (!validationResult.ok) {
        var validationErrors = validationResult.path + ': ' + validationResult.errors.join(' - ');
        return ctx.error(400, 'validation error on user object\n' + validationErrors);
    }

    if (!user.username.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i))
        return ctx.error(400, 'username is not a valid email');

    var authMngr = require('../cms/authMngr.js')(this.server);

    var createUser = function () {
        authMngr.create(user, function (err, result) {
            if (err) {
                if (err.message === 'username already exists') {
                    return ctx.status(401).send({
                        exists: true
                    });
                };

                return ctx.error(500, err);
            }

            if (result) {
                ctx.json(result);
            }
            else {
                ctx.json(null);
            }
        });
    }

    if (!authMngr.isAuthorized(ctx.req.session.user, 'users', 'C'))
        return ctx.error(401, 'Access Denied');

    if (user.roles.length === 0)
        return ctx.error(400, 'at least one role is required');

    _.each(user.roles, function (role) {
        if (!authMngr.isInRole(ctx.req.session.user, role)) {
            return ctx.error(401, 'access denied for role "' + role + '"');
        }
    });

    createUser();

};

AuthApi.prototype.register = function (ctx, fields) {
    var self = this;

    var user = {
        username: fields.username,
        firstName: fields.firstName,
        lastName: fields.lastName,
        password: fields.password,
        roles: fields.roles
    };

    var validator = new validation.JSONValidation();
    var validationResult = validator.validate(user, {
        type: 'object',
        required: true,
        properties: {
            username: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            },
            firstName: {
                type: 'string',
                required: true
            },
            lastName: {
                type: 'string',
                required: true
            },
            roles: {
                type: 'array',
                required: true,
                items: {
                    type: 'string'
                },
                enum: _.pluck(self.server.app.config.roles, 'name'),
                uniqueItems: true
            }
        }
    });
    if (!validationResult.ok) {
        var validationErrors = validationResult.path + ': ' + validationResult.errors.join(' - ');
        return ctx.error(400, 'validation error on user object\n' + validationErrors);
    }

    if (!user.username.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i))
        return ctx.error(400, 'username is not a valid email');

    var authMngr = require('../cms/authMngr.js')(this.server);

    var createUser = function () {
        authMngr.create(user, function (err, result) {
            if (err) {
                if (err.message === 'username already exists') {
                    return ctx.status(401).send({
                        exists: true
                    });
                };

                return ctx.error(500, err);
            }

            if (result) {
                ctx.req.session.uid = result.id;
                ctx.req.session.user = result;
                ctx.req.session.save(function () {
                    ctx.json(result);
                });
            }
            else {
                ctx.json(null);
            }
        });
    }

    var store = this.server.db.createStore('users');
    store.count(function (x) {
        x.query({});
    }, function (err, count) {
        if (count === 0) {
            if (user.roles.length === 0)
                return ctx.error(400, 'at least one role is required');

            if (user.roles.indexOf('sa') === -1)
                return ctx.error(400, 'first time user should be on the "sa" role');

            createUser();
        }
        else {
            if (user.roles.length === 0)
                return ctx.error(400, 'at least one role is required');

            _.each(user.roles, function (role) {
                if (!authMngr.isInRole(ctx.req.session.user, role)) {
                    return ctx.error(401, 'access denied for role "' + role + '"');
                }
            });

            createUser();
        }

    });

};

AuthApi.prototype.login = function (ctx, fields) {
    var authMngr = require('../cms/authMngr.js')(this.server);
    authMngr.authenticate(fields.username, fields.password, function (err, user) {
        if (err) {
            if (err.code && err.messages)
                ctx.error(err.code, err.messages);
            else
                ctx.error(500, err);
        }
        else {
            if (user) {
                ctx.req.session.uid = user.id;
                ctx.req.session.user = user;
                ctx.req.session.save(function () {
                    ctx.json(user);
                });
            }
            else {
                ctx.error(401, 'Access Denied');
            }
        }
    });
};

AuthApi.prototype.logout = function (ctx, fields) {
    var authMngr = require('../cms/authMngr.js')(this.server);
    authMngr.invalidate(function () {
        delete ctx.req.session.uid;
        delete ctx.req.session.user;
        ctx.req.session.save(function () {
            ctx.send({
                logout: true
            });
        });
    });
};

AuthApi.prototype.requestEmailChange = function (ctx, fields) {
    var authMngr = require('../cms/authMngr.js')(this.server);
    authMngr.requestEmailChange(ctx.req.session.user.id, fields.email, function (err, res) {
        if (err) {
            if (err.message === 'username already exists') {
                return ctx.status(401).send({
                    exists: true
                });
            };

            return ctx.error(500, err);
        }
        
        ctx.json(res);
    });
};

AuthApi.prototype.submitEmailChange = function (ctx, fields) {
    var authMngr = require('../cms/authMngr.js')(this.server);
    authMngr.submitEmailChange(ctx.req.session.user.id, fields.code, function (err, res, value) {
        if (err) 
            return ctx.error(500, err);
        
        if (res) 
            ctx.req.session.user.username = value;
        
        ctx.json(res);
    });
}

AuthApi.prototype.setPassword = function (ctx, fields) {
    var authMngr = require('../cms/authMngr.js')(this.server);
    authMngr.setPassword(ctx.req.session.user.id, fields.password, fields.newPassword, function (err, res) {
        if (err)
            ctx.error(err);

        ctx.json(res);
    });
};

AuthApi.prototype.forgotPassword = function (ctx, fields) {
    ctx.error(500, 'not implemented');
};

AuthApi.prototype.resetPassword = function (ctx, fields) {
    ctx.error(500, 'not implemented');
};

module.exports = function (server) {
    return new AuthApi(server);
};