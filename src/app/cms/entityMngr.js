var _ = require('underscore');
_.str = require('underscore.string');

var EntityManager = function(server, name) {

    var getEntity = function (name) {

        return _.find(server.app.config.entities, function (x) { return x.name === name; });

    };

    var entity = getEntity(name);
    if (!entity) {
        return {
            isLocalized: function () { return false },
            hasProperty: function () { return false },
            isSeoNamed: function () { return false }
        };
    }

    return {

        isLocalized: function () {

            return entity.localized === undefined || entity.localized === true;

        },

        hasProperty: function (property) {

            return entity.properties[property] === undefined || entity.properties[property] === true;

        },

        isSeoNamed: function () {

            return this.hasProperty('seo');

        }

    }

};

module.exports = EntityManager;