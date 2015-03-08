var app = require('./app.js');

module.exports = {

    // core module configs

    domain: 'core',
    browsable: false,

    public: false,

    // ssl: true,

    // locale: 'el',
    
    restricted: true,

    fileGroups: [
        'users',
        'public'
    ],

    images: [{
        name: 'admin-explorer-thumb',
        processors: [{
            type: 'stretch',
            options: {
                width: 60,
                height: 60
            }
        }]
    }, {
        name: 'admin-image-thumb',
        processors: [{
            type: 'stretch',
            options: {
                width: 60,
                height: 60
            }
        }]
    }],

    /*
    [{
        type: 'crop',
        options: {
            x: 0,
            y: 0,
            width: 60,
            height: 60
        }
    }, {
        type: 'fit',
        options: {
            width: 60,
            height: 60
        }
    }, {
        type: 'stretch',
        options: {
            width: 60,
            height: 60
        }
    }]
    */

    scripts: [],
    
    entities: [{
        name: 'page',
        allowed: ['page', 'pointer', 'custom'],
    }, {
        name: 'pointer',
        allowed: [],
        properties: {
            template: false,
            meta: false
        }
    }, {
        name: 'custom',
        allowed: [],
        properties: {
            meta: false
        }
    }],

    roles: [{
        name: 'public',
        inherits: []
    }, {
        name: 'member',
        inherits: ['public']
    }, {
        name: 'admin',
        inherits: ['member']
    }, {
        name: 'translator',
        inherits: ['admin']
    }, {
        name: 'sa',
        inherits: ['admin', 'translator']
    }],

    sections: [{
        name: 'languages',
        roles: ['sa']
    }, {
        name: 'layouts',
        roles: ['admin']
    }, {
        name: 'nodes',
        roles: ['admin']
    }, {
        name: 'modules',
        roles: ['admin']
    }, {
        name: 'data',
        roles: ['admin']
    }, {
        name: 'texts',
        roles: ['translator', 'sa']
    }, {
        name: 'files',
        roles: ['admin']
    }, {
        name: 'users',
        roles: ['admin']
    }, {
        name: 'settings',
        roles: ['sa']
    }],

    permissions: [{
        collection: 'languages',
        roles: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'sa',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'layouts',
        roles: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U']
        }]
    }, {
        collection: 'nodes',
        roles: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'data',
        roles: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'texts',
        roles: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'translator',
            crud: ['R', 'U']
        }, {
            role: 'sa',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'users',
        roles: [{
            role: 'admin',
            crud: ['C', 'R', 'U']
        }]
    }, {
        collection: 'settings',
        roles: [{
            role: 'sa',
            crud: ['C', 'R', 'U', 'D']
        }]
    }],


    injects: {
        navigation: [{
            index: 5,
            identifier: 'extra',
            name: 'extra',
            url: '/extra',
        }],
        dashboard: 'tmpl/public/injects/dashboard.html',
        content: 'tmpl/public/injects/content.html',
        settings: 'tmpl/public/injects/settings.html'
    },

    layouts: [{
        id: 'global',
        name: 'global layout',
        form: 'tmpl/public/layouts/global.html'
    }, {
        id: 'eshop',
        name: 'eshop layout',
        form: 'tmpl/public/layouts/eshop.html'
    }],

    containers: [{
        id: 'sampleContainer1',
        name: 'sample container A',
        html: '/tmpl/partial/containers/sampleContainerA.html',
    }, {
        id: 'sampleContainer2',
        name: 'sample container B',
        html: '/tmpl/partial/containers/sampleContainerB.html'
    }],

    templates: [{
        id: 'home',
        name: 'home page',
        html: '/tmpl/index.html',
        restricted: ['page']
    }, {
        id: 'login',
        name: 'login page',
        html: '/tmpl/login.html',
        restricted: ['page']
    }, {
        id: 'text',
        name: 'text page',
        html: '/tmpl/text.html',
        form: 'tmpl/public/forms/page/text.html'
    }, {
        id: 'nodes',
        name: 'nodes page',
        html: '/tmpl/nodes.html',
        form: 'tmpl/public/forms/page/nodes.html'
    }, {
        id: 'data',
        name: 'data page',
        html: '/tmpl/data.html',
        form: 'tmpl/public/forms/page/data.html'
    }, {
        id: 'files',
        name: 'files page',
        html: '/tmpl/files.html',
        form: 'tmpl/public/forms/page/files.html'
    }, {
        id: 'images',
        name: 'images page',
        html: '/tmpl/images.html',
        form: 'tmpl/public/forms/page/images.html'
    }, {
        id: 'search',
        name: 'search',
        html: '/tmpl/search.html'
    }, {
        id: 'facilities',
        name: 'facilities',
        html: '/tmpl/facilities.html',
        form: 'tmpl/public/forms/page/facilities.html'
    }],

    lists: [{
        id: 'sample1',
        name: 'Sample 01',
        form: 'tmpl/public/forms/list/sample1.html',
        localized: true,
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        id: 'sample2',
        name: 'Sample 02',
        form: 'tmpl/public/forms/list/sample2.html',
        localized: false
    }, {
        id: 'telephones',
        name: 'Telephones',
        form: 'tmpl/public/forms/list/telephones.html',
        localized: true
    }],

    routes: [{
        id: 'search',
        name: 'Search results',
        fn: 'routeSearch'
    }, {
        id: 'facilities',
        name: 'Facilities',
        fn: 'routeFacility'
    }]

}