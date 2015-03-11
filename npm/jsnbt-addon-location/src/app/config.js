module.exports = {

    domain: 'location',

    type: 'addon',

    pointed: true,

    version: require('../../package.json').version,

    jsModule: 'jsnbt-addon-location',

    scripts: [
        'http://maps.google.com/maps/api/js?sensor=true'
    ],

    entities: [{
        name: 'location',
        treeNode: true,
        localized: true
    }, {
        name: 'location-category',
        allowed: ['location'],
        treeNode: true,
        localized: true
    }]

};