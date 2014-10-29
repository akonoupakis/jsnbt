var app = require('./app.js');
var jsnbt = require('./jsnbt.js');

var _ = require('underscore');

_.str = require('underscore.string');

var getEntity = function (name) {

    var entityDefaults = {
        name: '',
        allowed: [],
        treeNode: true,
        localized: true,

        properties: {
            name: true,
            parent: true,
            template: true,
            seo: true,
            meta: true,
            permissions: true
        }
    };

    var entity = {};

    _.extend(entity, entityDefaults);

    var knownEntity = _.first(_.filter(jsnbt.entities, function (x) { return x.name === name; }));
    if(knownEntity)
    {
        _.extend(entity, knownEntity);
        return entity;
    }
    else{
        return undefined;
    }

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

        }

    }

};