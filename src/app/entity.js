var app = require('./app.js');
var jsnbt = require('./jsnbt.js');

var _ = require('underscore');

_.str = require('underscore.string');

var getEntity = function (name) {

    return _.first(_.filter(jsnbt.entities, function (x) { return x.name === name; }));

};

module.exports = function(name) {

    var entity = getEntity(name);
    if (!entity)
        return undefined;

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