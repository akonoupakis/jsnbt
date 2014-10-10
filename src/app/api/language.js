var app = require('../app.js');
var languageRepositry = require('../repo/language.js');
var _ = require('underscore');

module.exports = {

    getDefault: function (user, draft, fields) {
        return languageRepositry.getDefault();
    },

    getActive: function (user, draft, fields) {
        return languageRepositry.getActive();
    }

}