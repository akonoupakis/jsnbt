var app = require('../app.js');
var auth = require('../user.js');
var fileRepository = require('../repo/file.js');

module.exports = {
    
    get: function (user, draft, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return fileRepository.get(user, draft, fields);
    },

    delete: function (user, draft, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return fileRepository.delete(user, draft, fields);
    },

    create: function (user, draft, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return fileRepository.create(user, draft, fields);
    },

    move: function (user, draft, fields) {
        if (!auth.isInRole(user, 'admin'))
            return null;

        return fileRepository.move(user, draft, fields);
    }

};