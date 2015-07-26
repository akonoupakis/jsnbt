module.exports = [{
    id: 'admin',
    name: 'admin page',
    html: '/admin/index.html',
    restricted: [],
    scripts: [
        ['admin-lib', 'admin-app'],
        'admin-scripts'
    ],
    styles: [
        ['admin-lib', 'admin-app']
    ]
}, {
    id: 'admin-error',
    name: 'admin error page',
    html: '/admin/err/error.html',
    restricted: [],
    scripts: [
        ['admin-lib', 'admin-app'],
        'admin-scripts'
    ],
    styles: [
        ['admin-lib', 'admin-app']
    ]
}];