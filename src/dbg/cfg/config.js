module.exports = {
    
    ssl: false,

    // locale: 'el',
    
    fileGroups: [],

    images: require('./images.js'),

    //scripts: {
    
    //    common: [
    //        '/js/app/controllers/AppController.js',
    //        '/js/app/main.js'
    //    ],
    //    lib: [
    //        '/js/app/controllers/AppController.js',
    //        '/js/app/main.js',
    //        '/js/index.js'
    //    ]
    
    //},

    //styles: {

    //    common: 'css/_.less'

    //},
    
    entities: [],

    roles: [],

    sections: [],

    collections: [],
    
    injects: require('./injects.js'),

    layouts: require('./layouts.js'),

    containers: require('./containers.js'),

    templates: require('./templates.js'),

    lists: require('./lists.js'),

    routes: require('./routes.js'),

    messaging: require('./messaging.js'),

    register: function () {

        return {
            alpha: 1,
            vita: {
                gama: 3,
                delta: 4
            },
            epsilon: 5
        };

    }

}