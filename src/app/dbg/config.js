module.exports = {
    
    domain: 'public',
    browsable: false,

    public: true,

    ssl: true,

    // locale: 'el',
    
    restricted: true,

    fileGroups: [],

    images: [{
        name: 'site-thumb',
        processors: [{
            type: 'stretch',
            options: {
                width: 60,
                height: 60
            }
        }]
    }],

    scripts: [],
    
    entities: [],

    roles: [],

    sections: [],

    permissions: [],
    
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