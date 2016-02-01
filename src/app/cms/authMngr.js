var moment = require('moment');
var md5 = require('md5');
var extend = require('extend');
var random = new require("random-js")();
var _ = require('underscore');
_.str = require('underscore.string');

var getSubRoles = function (server, role) {
    var results = [];

    var matchedRole = _.find(server.app.config.roles, function (x) { return x.name === role; });
    if (matchedRole) {
        results.push(role);

        if (matchedRole.inherits) {
            _.each(matchedRole.inherits, function (item) {
                var allRoles = getSubRoles(server, item);
                _.each(allRoles, function (rol) {
                    if (results.indexOf(rol) === -1) {
                        results.push(rol);
                    }
                });
            });
        }
    }

    return results;
};

var getUserRoles = function (server, user) {
    var roles = (user || {}).roles || ['public'];

    var allRoles = [];

    _.each(roles, function (item) {
        var itemRoles = getSubRoles(server, item);
        _.each(itemRoles, function (rol) {
            if (allRoles.indexOf(rol) === -1) {
                allRoles.push(rol);
            }
        });
    });

    return allRoles;
};

var isUserAuthorized = function (server, user, section, permission) {

    var result = false;

    if (server.app.config.collections[section]) {


        if (server.app.config.collections[section].permissions === false) {
            result = true;
        }
        else if (_.isArray(server.app.config.collections[section].permissions)) {
            var roles = getUserRoles(server, user);
            result = false;

            _.each(server.app.config.collections[section].permissions, function (perm) {
                if (roles.indexOf(perm.role) !== -1) {
                    if (perm.crud.indexOf(permission) !== -1)
                        result = true;
                }
            });
        }
    }

    return result;
};

var isUserNodeAuthorized = function (server, user, section, permission) {
    var sectionParts = section.split(':');
    if (sectionParts.length === 2) {
        var dataName = sectionParts[0];
        var entityName = sectionParts[1];

        if (server.app.config.entities[entityName] && server.app.config.entities[entityName].permissions) {
            var roles = getUserRoles(server, user);
            result = false;

            _.each(server.app.config.entities[entityName].permissions, function (perm) {
                if (roles.indexOf(perm.role) !== -1) {
                    if (perm.crud.indexOf(permission) !== -1)
                        result = true;
                }
            });

            return result;
        }
        else {
            return isUserAuthorized(server, user, 'nodes', permission);
        }
    }
    else {
        return isUserAuthorized(server, user, 'nodes', permission);
    }
};

var isUserDataAuthorized = function (server, user, section, permission) {
    var sectionParts = section.split(':');
    if (sectionParts.length === 3) {
        var dataName = sectionParts[0];
        var domainName = sectionParts[1];
        var listName = sectionParts[2];

        var list = _.find(server.app.config.lists, function (x) { return x.domain === domainName && x.id === listName; });
        if (list && list.permissions) {
            var roles = getUserRoles(server, user);
            result = false;

            _.each(list.permissions, function (perm) {
                if (roles.indexOf(perm.role) !== -1) {
                    if (perm.crud.indexOf(permission) !== -1)
                        result = true;
                }
            });

            return result;
        }
        else {
            return isUserAuthorized(server, user, 'data', permission);
        }
    }
    else {
        return isUserAuthorized(server, user, 'data', permission);
    }
};

var AuthManager = function (server) {

    this.server = server;

};

AuthManager.prototype.isInRole = function (user, role, cb) {
    var roles = getUserRoles(this.server, user);

    if (typeof (role) === 'string') {
        var result = false;
        result = roles.indexOf(role) !== -1;

        if (typeof (cb) === 'function')
            cb(null, result);

        return result;
    }
    else {
        var result = false;
        _.each(roles, function (r) {
            if (role.indexOf(r) !== -1) {
                result = true;
                return false;
            }
        });

        if (typeof (cb) === 'function')
            cb(null, result);

        return result;
    }
};

AuthManager.prototype.isAuthorized = function (user, section, permission, cb) {
    if (section.indexOf(':') !== -1) {
        var sectionParts = section.split(':');
        if (sectionParts[0] === 'data') {
            var result = isUserDataAuthorized(this.server, user, section, permission);

            if (typeof (cb) === 'function')
                cb(null, result);

            return result;
        }
        else if (sectionParts[0] === 'nodes') {
            var result = isUserNodeAuthorized(this.server, user, section, permission);

            if (typeof (cb) === 'function')
                cb(null, result);

            return result;
        }
        else {
            var result = isUserAuthorized(this.server, user, section, permission);

            if (typeof (cb) === 'function')
                cb(null, result);

            return result;
        }
    }
    else {
        var result = isUserAuthorized(this.server, user, section, permission);

        if (typeof (cb) === 'function')
            cb(null, result);

        return result;
    }
};

AuthManager.prototype.create = function (user, cb) {

    var store = this.server.db.createStore('users');
    store.count(function (x) {
        x.query({
            username: user.username
        });
    }, function (err, count) {
        if (err)
            return cb(err);

        if (count > 0)
            return cb(new Error('username already exists'));

        

        var newUser = {};
        extend(true, newUser, user);
        delete newUser.password;

        newUser.password = md5(user.password);
        
        store.post(function (x) {
            x.data(newUser);
        }, function (err, result) {
            if (err)
                return cb(err);

             delete result.password;

            return cb(null, result);
        });

    });
};

AuthManager.prototype.authenticate = function (username, password, cb) {
    var store = this.server.db.createStore('users');

    store.get(function (x) {
        x.query({ username: username });
        x.single();
    }, function (err, user) {
        if (err) 
            return cb(err);

        if (user) {
            if (md5(password) === user.password) {
                delete user.password;
                cb(null, user);
            }
            else {
                cb(new Error(401, 'Access Denied'));
            }
        }
        else {
            cb(new Error(401, 'Access Denied'));
        }
    });
};

AuthManager.prototype.invalidate = function (cb) {
    cb();
};

AuthManager.prototype.setPassword = function (userId, oldPassword, password, cb) {
    var store = this.server.db.createStore('users');
    store.get(function (x) {
        x.query({ id: userId });
        x.single();
    }, function (err, user) {
        if (err)
            return cb(err);

        if (user) {
            var oldHash = md5(oldPassword);

            if (oldHash === user.password) {
                var newHash = md5(password);

                store.put(function (x) {
                    x.query({ id: userId });
                    x.data({
                        password: newHash
                    });
                }, function (err, result) {
                    if (err)
                        return cb(err);
                    
                    cb(null, true);
                });
            }
            else {
                cb(null, false);
            }
        }
        else {
            cb(null, false);
        }
    });

};

AuthManager.prototype.requestEmailChange = function (userId, email, cb) {
    var self = this;

    var store = this.server.db.createStore('users');
    store.count(function (x) {
        x.query({
            username: email
        });
    }, function (err, count) {
        if (err)
            return cb(err);

        if (count > 0)
            return cb(new Error('username already exists'));

        store.get(function (x) {
            x.query(userId);
            x.single();
        }, function (err, res) {
            if (err)
                return cb(err);

            var code = random.string(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            var expiresAt = moment(new Date()).add(5, 'minutes')._d.getTime();

            var templateCode = 'email-change';
            self.server.messager.mail.getTemplate(templateCode, function (tmplErr, tmpl) {
                if (tmplErr)
                    return cb(tmplErr);

                self.server.messager.mail.getModel(templateCode, function (modelErr, model) {
                    if (modelErr)
                        return cb(modelErr);

                    model.code = code;
                    model.email = email;
                    model.firstName = res.firstName;
                    model.lastName = res.lastName;

                    self.server.messager.mail.parseTemplate(tmpl, model, function (parseErr, parsedTmpl) {
                        if (parseErr)
                            return cb(parseErr);

                        self.server.messager.mail.getSender(function (senderErr, sender) {
                            if (senderErr)
                                return cb(senderErr);

                            sender.send({
                                to: email,
                                subject: parsedTmpl.subject,
                                body: parsedTmpl.body
                            }, function (sendErr, response) {
                                if (sendErr)
                                    return cb(sendErr);

                                store.put(function (x) {
                                    x.query(userId);
                                    x.data({
                                        emailChange: {
                                            email: email,
                                            code: code,
                                            expiresAt: expiresAt
                                        }
                                    });
                                }, function (err, res) {
                                    if (err)
                                        return cb(err);

                                    cb(null, true);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

AuthManager.prototype.submitEmailChange = function (userId, code, cb) {

    var store = this.server.db.createStore('users');
    store.get(function (x) {
        x.query({
            id: userId,
            'emailChange.code': code
        });
        x.single();
    }, function (err, res) {
        if (err)
            return cb(err);

        if (res) {
            var now = moment(new Date());
            var then = moment(res.emailChange.expiresAt);

            if (then.isAfter(now)) {
                var newEmail = res.emailChange.email
                store.put(function(x) {
                    x.query(userId);
                    x.data({
                        $set: { username: newEmail },
                        $unset: { emailChange: '' }
                    });
                }, function (err, res) {
                    if (err)
                        return cb(err);

                    cb(null, true, newEmail);
                });
            }
            else {
                cb(null, false);
            }
        }
        else {
            cb(null, false);
        }
    });

};

AuthManager.prototype.requestPasswordReset = function (email, cb) {
    var self = this;

    var store = this.server.db.createStore('users');
    store.get(function (x) {
        x.query({
            username: email
        });
        x.single();
    }, function (err, res) {
        if (err)
            return cb(err);

        if (res) {

            var code = random.string(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            var expiresAt = moment(new Date()).add(5, 'minutes')._d.getTime();

            var templateCode = 'password-reset';
            self.server.messager.mail.getTemplate(templateCode, function (tmplErr, tmpl) {
                if (tmplErr)
                    return cb(tmplErr);

                self.server.messager.mail.getModel(templateCode, function (modelErr, model) {
                    if (modelErr)
                        return cb(modelErr);

                    model.code = code;
                    model.email = email;
                    model.firstName = res.firstName;
                    model.lastName = res.lastName;

                    self.server.messager.mail.parseTemplate(tmpl, model, function (parseErr, parsedTmpl) {
                        if (parseErr)
                            return cb(parseErr);

                        self.server.messager.mail.getSender(function (senderErr, sender) {
                            if (senderErr)
                                return cb(senderErr);

                            sender.send({
                                to: email,
                                subject: parsedTmpl.subject,
                                body: parsedTmpl.body
                            }, function (sendErr, response) {
                                if (sendErr)
                                    return cb(sendErr);

                                store.put(function (x) {
                                    x.query(res.id);
                                    x.data({
                                        passwordReset: {
                                            code: code,
                                            expiresAt: expiresAt
                                        }
                                    });
                                }, function (err, res) {
                                    if (err)
                                        return cb(err);

                                    cb(null, true);
                                });
                            });
                        });
                    });
                });
            });

        }
        else {
            return cb(new Error('email not found'));
        }
    });
};

AuthManager.prototype.submitPasswordReset = function (email, code, password, cb) {
    var store = this.server.db.createStore('users');
    store.get(function (x) {
        x.query({
            username: email,
            'passwordReset.code': code
        });
        x.single();
    }, function (err, res) {
        if (err)
            return cb(err);

        if (res) {
            var now = moment(new Date());
            var then = moment(res.passwordReset.expiresAt);

            if (then.isAfter(now)) {
                var newHash = md5(password);
                store.put(function (x) {
                    x.query(res.id);
                    x.data({
                        $set: { password: newHash },
                        $unset: { passwordReset: '' }
                    });
                }, function (err, res) {
                    if (err)
                        return cb(err);

                    cb(null, true);
                });
            }
            else {
                cb(null, false);
            }
        }
        else {
            cb(null, false);
        }
    });
};

module.exports = function (server) {
    return new AuthManager(server);
};