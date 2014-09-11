var path = require('path');

module.exports = {
    getPath: function (paths) {
        return path.normalize(__dirname + '../../../' + paths);
    }
};