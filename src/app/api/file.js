var app = require('../app.js');
var auth = require('../user.js');
var file = require('../file.js');

module.exports = {
    
    get: function (user, draft, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return file.get(user, draft, fields);
    },

    delete: function (user, draft, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return file.delete(user, draft, fields);
    },

    create: function (user, draft, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return file.create(user, draft, fields);
    },

    move: function (user, draft, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return file.move(user, draft, fields);
    }

};