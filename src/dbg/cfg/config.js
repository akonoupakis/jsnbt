module.exports = {
    
    ssl: false,

    // locale: 'el',
    
    restricted: true,

    fileGroups: [],

    images: require('./images.js'),

    scripts: [],
    
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