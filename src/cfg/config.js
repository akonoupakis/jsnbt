module.exports = {
    
    fileGroups: [
        'users',
        'public'
    ],

    images: require('./images.js'),

    scripts: [],

    //scripts: {

    //    admin: [
    //        '/admin/js/app/controllers/AppController.js',
    //        '/admin/js/app/main.js'
    //    ]

    //},

    //styles: {

    //    admin: ['/public/css/_.less', '/public/css/style.less']

    //},
    
    entities: require('./entities.js'),

    roles: require('./roles.js'),

    sections: require('./sections.js'),

    collections: require('./collections.js'),
    
    lists: [],

    messaging: require('./messaging.js'),

    templates: [{
        id: 'admin',
        name: 'admin page',
        html: '/admin/index.html',
        restricted: ['na'],
        scripts: [
            ['lib', 'common'],
            'gmaps'
        ],
        styles: [
            ['common']
        ]
    }]

}