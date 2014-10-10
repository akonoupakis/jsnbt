var app = require('../app.js');
var auth = require('../user.js');
var nodeRepositry = require('../repo/node.js');

var _ = require('underscore');

module.exports = {

    get: function (user, draft, fields) {
        if (fields.language) {
            var result = nodeRepositry.get(user, draft, fields);

            var hasRole = false;
            _.each(result.permissions, function (role) {
                if (auth.isInRole(user, role))
                    hasRole = true;
            });

            if (!hasRole)
                return undefined;

            return result;
        }
        else {
            var nodes = nodeRepositry.get(user, draft, fields);
            var results = [];

            _.each(nodes, function (node) {
                var hasRole = false;
                _.each(node.permissions, function (role) {
                    if (auth.isInRole(user, role))
                        hasRole = true;
                });

                if (hasRole)
                    results.push(node);
            });

            return results;
        }
    },

    getPage: function (user, draft, fields) {
        var nodes = nodeRepositry.getPage(user, draft, fields);

        var results = [];

        _.each(nodes, function (node) {

            var hasRole = false;
            _.each(node.permissions, function (role) {
                if (auth.isInRole(user, role))
                    hasRole = true;
            });

            if (hasRole) {
                results.push(node);
            }

        });

        return results;
    }

}