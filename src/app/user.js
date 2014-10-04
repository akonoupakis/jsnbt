var app = require('./app.js');
var jsnbt = require('./jsnbt.js');
var _ = require('underscore');

_.str = require('underscore.string');

var getSubRoles = function (role) {
    var results = [];

    var matchedRole = _.first(_.filter(jsnbt.roles, function (x) { return x.name === role; }));
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

exports.isInRole = function (user, role) {
    var roles = getUserRoles(user);
    return roles.indexOf(role) !== -1;
};

exports.isAuthorized = function (user, section, permission) {
    var dataCollections = jsnbt.data || [];

    var dataCollection = _.first(_.filter(dataCollections, function (x) { return x.collection === section; }));

    var result = false;

    if (dataCollection) {
        var roles = getUserRoles(user);
        result = false;

        _.each(dataCollection.permissions, function (perm) {
            if (roles.indexOf(perm.role) !== -1) {
                if (perm.crud.indexOf(permission) !== -1)
                    result = true;
            }
        });
    }
    else {
        result = true;
    }

    return result;
};