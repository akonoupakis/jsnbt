var app = require('./app.js');

module.exports = {

    domain: 'core',

    public: true,
    
    images: [{
        name: 'admin-explorer-thumb',
        processors: [{
            type: 'crop',
            options: {
                width: 60,
                height: 60,
                cropwidth: 60,
                cropheight: 60,
                x: 0,
                y: 0,
                gravity: 'center',
                fill: true
            }
        }]
    }],

    injects: {
        navigation: [{
            index: 0,
            identifier: 'layout',
            name: 'layout',
            url: '/layout',
        }, {
            index: 2,
            identifier: 'layout2',
            name: 'layout2',
            url: '/layout2',
        }],
        dashboard: 'tmpl/test/dashboardSpec.html',
        content: 'tmpl/test/contentSpec.html',
        settings: 'tmpl/test/settingsSpec.html'
    },

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
        name: 'nodes',
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

    data: [{
        collection: 'languages',
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'sa',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'nodes',
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'data',
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        collection: 'texts',
        permissions: [{
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
        permissions: [{
            role: 'admin',
            crud: ['C', 'R', 'U']
        }]
    }, {
        collection: 'settings',
        permissions: [{
            role: 'sa',
            crud: ['C', 'R', 'U', 'D']
        }]
    }],

    templates: [{
        path: '/tmpl/index.html',
        restricted: ['page']
    }, {
        path: '/tmpl/login.html',
        restricted: ['page']
    }, {
        path: '/tmpl/text.html',
        spec: '/tmpl/spec/page/text.html'
    }, {
        path: '/tmpl/nodes.html',
        spec: '/tmpl/spec/page/nodes.html'
    }, {
        path: '/tmpl/data.html',
        spec: '/tmpl/spec/page/data.html'
    }, {
        path: '/tmpl/files.html',
        spec: '/tmpl/spec/page/files.html'
    }, {
        path: '/tmpl/images.html',
        spec: '/tmpl/spec/page/images.html'
    }],

    lists: [{
        name: 'Sample 01',
        spec: '/tmpl/spec/list/sample1.html',
        localized: true,
        permissions: [{
            role: 'public',
            crud: ['R']
        }, {
            role: 'admin',
            crud: ['C', 'R', 'U', 'D']
        }]
    }, {
        name: 'Sample 02',
        spec: '/tmpl/spec/list/sample2.html',
        localized: false
    }]
}