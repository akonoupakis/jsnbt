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
                else {
                    return isUserAuthorized(user, section, permission);
                }
            }
            else {
                return isUserAuthorized(user, section, permission);
            }
        }

    };

};

module.exports = AuthorizationManager;