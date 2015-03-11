var app = require('../app.js');
var auth = require('../auth.js');
var file = require('../file.js');

module.exports = {
    
    get: function (user, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return file.get(fields);
    },

    delete: function (user, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return file.delete(fields);
    },

    create: function (user, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return file.create(fields);
    },

    move: function (user, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return file.move(fields);
    }

};