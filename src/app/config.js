var app = require('./app.js');

module.exports = {

    // core module configs

    domain: 'core',
    browsable: false,
    public: true,
    ssl: true,
    //locale: 'el',

    // common module configs

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
        allowed: ['page', 'pointer'],
    }, {
        name: 'pointer',
        allowed: [],
        properties: {
            template: false,
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

    layouts: {
        global: 'tmpl/public/layouts/global.html',
        eshop: 'tmpl/public/layouts/eshop.html'
    },

    containers: [{
        name: 'sample container A',
        html: '/tmpl/partial/containers/sampleContainerA.html',
    }, {
        name: 'sample container B',
        html: '/tmpl/partial/containers/sampleContainerB.html'
    }],

    templates: [{
        path: '/tmpl/index.html',
        restricted: ['page']
    }, {
        path: '/tmpl/login.html',
        restricted: ['page']
    }, {
        path: '/tmpl/text.html',
        form: 'tmpl/public/forms/page/text.html'
    }, {
        path: '/tmpl/nodes.html',
        form: 'tmpl/public/forms/page/nodes.html'
    }, {
        path: '/tmpl/data.html',
        form: 'tmpl/public/forms/page/data.html'
    }, {
        path: '/tmpl/files.html',
        form: 'tmpl/public/forms/page/files.html'
    }, {
        path: '/tmpl/images.html',
        form: 'tmpl/public/forms/page/images.html'
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
    }]

}