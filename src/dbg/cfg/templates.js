module.exports = [{
    id: 'home',
    name: 'home page',
    html: '/tmpl/index.html',
    restricted: ['page'],
    scripts: ['lib', 'common'],
    styles: ['common']
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
}];