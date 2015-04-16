module.exports = {
    
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
        allowed: ['page', 'pointer', 'router'],
    }, {
        name: 'pointer',
        allowed: [],
        properties: {
            template: false,
            meta: false
        }
    }, {
        name: 'router',
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
        auth: false,
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

    lists: []

}