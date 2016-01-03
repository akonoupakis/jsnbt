var moment = require('moment');
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

var AuthorizationManager = function (server) {

    this.server = server;

};

AuthorizationManager.prototype.isInRole = function (user, role) {
    var roles = getUserRoles(this.server, user);

    if (typeof (role) === 'string') {
        return roles.indexOf(role) !== -1;
    }
    else {
        var result = false;
        _.each(roles, function (r) {
            if (role.indexOf(r) !== -1) {
                result = true;
                return false;
            }
        });
        return result;
    }
};

AuthorizationManager.prototype.isAuthorized = function (user, section, permission) {
    if (section.indexOf(':') !== -1) {
        var sectionParts = section.split(':');
        if (sectionParts[0] === 'data') {
            return isUserDataAuthorized(this.server, user, section, permission);
        }
        else if (sectionParts[0] === 'nodes') {
            return isUserNodeAuthorized(this.server, user, section, permission);
        }
        else {
            return isUserAuthorized(this.server, user, section, permission);
        }
    }
    else {
        return isUserAuthorized(this.server, user, section, permission);
    }
};

AuthorizationManager.prototype.requestEmailConfirmationCode = function (user, email, cb) {
    var self = this;

    var store = this.server.db.createStore('users');
    store.find({ id: user.id }, function (err, res) {
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

                            store.update(user.id, {
                                $set: {
                                    emailChange: {
                                        email: email,
                                        code: code,
                                        expiresAt: expiresAt
                                    }
                                }
                            }, function (err, res) {
                                if (err)
                                    return cb(err);

                                cb(null, code);
                            });
                        });
                    });
                });
            });
        });
    });

};

AuthorizationManager.prototype.submitEmailConfirmationCode = function (user, code, cb) {

    var store = server.db.createStore('users');
    store.find({ id: user.id, 'emailChange.code': code }, function (err, res) {
        if (err)
            return cb(err);

        if (_.isObject(res) && res.id) {
            var now = moment(new Date());
            var then = moment(res.emailChange.expiresAt);

            if (then.isAfter(now)) {
                store.update(user.id, { $set: { username: res.emailChange.email }, $unset: { emailChange: '' } }, function (err, res) {
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
    return new AuthorizationManager(server);
};