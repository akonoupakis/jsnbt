var app = require('../app.js');
var dpdSync = require('dpd-sync');
var _ = require('underscore');

module.exports = {

    getDefault: function () {
        var defaultLanguage = 'en';

        var dbDefaultLanguages = dpdSync.call(app.dpd.languages.get, { active: true, "default": true });
        if (dbDefaultLanguages.length > 0)
            defaultLanguage = _.first(dbDefaultLanguages).code;

        return defaultLanguage;
    },

    getActive: function () {
        var dbLanguages = dpdSync.call(app.dpd.languages.get, { active: true });
        return _.pluck(dbLanguages, 'code');
    }

}