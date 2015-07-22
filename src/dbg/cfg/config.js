module.exports = {
    
    ssl: false,

    // locale: 'el',
    
    fileGroups: [],

    images: require('./images.js'),

    scripts: [{
        name: 'common',
        items: [
            '/js/app/controllers/AppController.js',
            '/js/app/main.js'
        ]
    }, {
        name: 'gmaps',
        process: false,
        items: [
                'http://asdasd.com/asdfasf/qwerqwerqw'
        ]
    }, {
        name: 'lib',
        items: [
            '/js/app/controllers/AppController.js',
            '/js/app/main.js',
            '/js/index.js'
        ]
    }],

    styles: [{
        name: 'common',
        items: [
                'css/_.less'
        ]
    }, {
        name: 'gfonts',
        process: false,
        items: [
            'http://asdfasdf.qwerqwer.com/asdfasf/asdf/'
        ]
    }],
    
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