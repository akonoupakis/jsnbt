var packInfo = require('../../package.json');

module.exports = {

    addon: true,

    domain: 'location',

    version: packInfo.version,

    scripts: {
        admin: ['http://maps.google.com/maps/api/js?sensor=true']
    },

    entities: [{
        name: 'location',
        treeNode: true,
        localized: true
    }, {
        name: 'location-category',
        allowed: ['location'],
        treeNode: true,
        localized: true
    }],

    modules: {
        public: ['jsnbt-addon-location'],
        admin: ['jsnbt-addon-location']
    },

    config: {

    },

    init: function (appplication) {

    }

};