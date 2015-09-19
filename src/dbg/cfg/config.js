module.exports = {
    
    ssl: false,

    // locale: 'el',
    
    fileGroups: [],

    images: require('./images.js'),
    
    entities: [],

    roles: [],

    sections: [],

    collections: [],
    
    injects: require('./injects.js'),

    layouts: require('./layouts.js'),

    containers: require('./containers.js'),

    templates: require('./templates.js'),

    scripts: require('./scripts.js'),

    styles: require('./styles.js'),

    lists: require('./lists.js'),

    routes: require('./routes.js'),

    messaging: require('./messaging.js'),

    content: [{
        id: 'files2',
        title: 'files',
        subtitle: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fringilla nunc vel cursus consequat. Pellentesque sit amet libero vel risus tristique euismod sed quis eros.',
        image: 'img/core/content/files.png',
        url: '/content/files'
    }],

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