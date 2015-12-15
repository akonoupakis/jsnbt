module.exports = {
    
    //name: {
    //    image: 'img/public/logo.jpg',
    //    title: 'site name'
    //},

    ssl: false,

    // locale: 'el',
    
    fileGroups: [],

    images: require('./images.js'),
    
    entities: require('./entities.js'),

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