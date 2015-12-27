var moment = require('moment');
var random = new require("random-js")();
var _ = require('underscore');
_.str = require('underscore.string');

var AuthorizationManager = function (server) {

    var getSubRoles = function (role) {
        var results = [];

        var matchedRole = _.find(server.app.config.roles, function (x) { return x.name === role; });
        if (matchedRole) {
            results.push(role);

            if (matchedRole.inherits) {
                _.each(matchedRole.inherits, function (item) {
                    var allRoles = getSubRoles(item);
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

    var getUserRoles = function (user) {
        var roles = (user || {}).roles || ['public'];

        var allRoles = [];

        _.each(roles, function (item) {
            var itemRoles = getSubRoles(item);
            _.each(itemRoles, function (rol) {
                if (allRoles.indexOf(rol) === -1) {
                    allRoles.push(rol);
                }
            });
        });

        return allRoles;
    }

    var isUserAuthorized = function (user, section, permission) {

        var result = false;

        if (server.app.config.collections[section]) {

      
            if (server.app.config.collections[section].permissions === false) {
                result = true;
            }
            else if (_.isArray(server.app.config.collections[section].permissions)) {
                var roles = getUserRoles(user);
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
    }

    var isUserNodeAuthorized = function (user, section, permission) {
        var sectionParts = section.split(':');
        if (sectionParts.length === 2) {
            var dataName = sectionParts[0];
            var entityName = sectionParts[1];

            if (server.app.config.entities[entityName] && server.app.config.entities[entityName].permissions) {
                var roles = getUserRoles(user);
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
                return isUserAuthorized(user, 'nodes', permission);
            }
        }
        else {
            return isUserAuthorized(user, 'nodes', permission);
        }
    }

    var isUserDataAuthorized = function (user, section, permission) {
        var sectionParts = section.split(':');
        if (sectionParts.length === 3) {
            var dataName = sectionParts[0];
            var domainName = sectionParts[1];
            var listName = sectionParts[2];

            var list = _.find(server.app.config.lists, function (x) { return x.domain === domainName && x.id === listName; });
            if (list && list.permissions) {
                var roles = getUserRoles(user);
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
                return isUserAuthorized(user, 'data', permission);
            }
        }
        else {
            return isUserAuthorized(user, 'data', permission);
        }
    }

    return {

        isInRole: function (user, role) {
            var roles = getUserRoles(user);

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
        },

        isAuthorized: function (user, section, permission) {
            if (section.indexOf(':') !== -1) {
                var sectionParts = section.split(':');
                if (sectionParts[0] === 'data') {
                    return isUserDataAuthorized(user, section, permission);
                }
                else if (sectionParts[0] === 'nodes') {
                    return isUserNodeAuthorized(user, section, permission);
                }
                else {
                    return isUserAuthorized(user, section, permission);
                }
            }
            else {
                return isUserAuthorized(user, section, permission);
            }
        },

        requestEmailConfirmationCode: function (ctx, user, email, cb) {

            var store = server.db.createStore('users');
            store.find({ id: user.id }, function (err, res) {
                if (err) {
                    cb(err);
                }
                else {
                    var code = random.string(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
                    var expiresAt = moment(new Date()).add(5, 'minutes')._d.getTime();
                    
                    var templateCode = 'email-change';
                    server.messager.mail.getTemplate(templateCode, function (err, tmpl) {
                        if (err) {
                            cb(err);
                        }
                        else {
                            server.messager.mail.getModel(templateCode, function (modelErr, model) {
                                if (modelErr) {
                                    cb(modelErr);
                                }
                                else {

                                    model.code = code;
                                    model.email = email;
                                    model.firstName = res.firstName;
                                    model.lastName = res.lastName;

                                    server.messager.mail.parseTemplate(tmpl, model, function (parseErr, parsedTmpl) {
                                        if (parseErr) {
                                            cb(parseErr);
                                        }
                                        else {
                                            server.messager.mail.getSender(ctx.db, function (senderErr, sender) {
                                                if (senderErr) {
                                                    cb(senderErr);
                                                }
                                                else {
                                                    sender.send({
                                                        to: email,
                                                        subject: parsedTmpl.subject,
                                                        body: parsedTmpl.body
                                                    }, function (sendErr, response) {
                                                        if (sendErr) {
                                                            cb(sendErr);
                                                        }
                                                        else {
                                                            store.update(user.id, {
                                                                $set: {
                                                                    emailChange: {
                                                                        email: email,
                                                                        code: code,
                                                                        expiresAt: expiresAt
                                                                    }
                                                                }
                                                            }, function (err, res) {
                                                                if (err) {
                                                                    cb(err);
                                                                }
                                                                else {
                                                                    cb(null, code);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

        },

        submitEmailConfirmationCode: function (ctx, user, code, cb) {

            var store = server.db.createStore('users');
            store.find({ id: user.id, 'emailChange.code': code }, function (err, res) {
                if (err) {
                    cb(err);
                }
                else {
                    if (_.isObject(res) && res.id) {
                        var now = moment(new Date());
                        var then = moment(res.emailChange.expiresAt);

                        if (then.isAfter(now)) {
                            store.update(user.id, { $set: { username: res.emailChange.email }, $unset: { emailChange: '' } }, function (err, res) {
                                if (err) {
                                    cb(err);
                                }
                                else {
                                    cb(null, true);
                                }
                            });
                        }
                        else {
                            cb(null, false);
                        }
                    }
                    else {
                        cb(null, false);
                    }
                }
            });

        }

    };

};

module.exports = AuthorizationManager;