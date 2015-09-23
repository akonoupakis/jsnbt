module.exports = [{
    id: 'error',
    name: 'error page',
    html: '/err/error.html',
    restricted: [],
    scripts: [
        ['lib', 'app']
    ],
    styles: [
        ['lib', 'app']
    ]
}, {
    id: 'home',
    name: 'home page',
    html: '/tmpl/index.html',
    restricted: ['page'],
    scripts: [
        ['lib', 'app']
    ],
    styles: [
        ['lib', 'app']
    ]
}, {
    id: 'login',
    name: 'login page',
    html: '/tmpl/login.html',
    restricted: ['page']
}, {
    id: 'text',
    name: 'text page',
    html: '/tmpl/text.html',
    form: 'tmpl/public/forms/page/text.html',
    restricted: ['page']
}, {
    id: 'nodes',
    name: 'nodes page',
    html: '/tmpl/nodes.html',
    form: 'tmpl/public/forms/page/nodes.html',
    restricted: ['page']
}, {
    id: 'data',
    name: 'data page',
    html: '/tmpl/data.html',
    form: 'tmpl/public/forms/page/data.html',
    restricted: ['page']
}, {
    id: 'files',
    name: 'files page',
    html: '/tmpl/files.html',
    form: 'tmpl/public/forms/page/files.html',
    restricted: ['page']
}, {
    id: 'images',
    name: 'images page',
    html: '/tmpl/images.html',
    form: 'tmpl/public/forms/page/images.html',
    restricted: ['courseLevel']
}, {
    id: 'search',
    name: 'search',
    html: '/tmpl/search.html',
    restricted: ['course']
}, {
    id: 'facilities',
    name: 'facilities',
    html: '/tmpl/facilities.html',
    form: 'tmpl/public/forms/page/facilities.html',
    restricted: ['courseSet']
}, {
    id: 'articles',
    name: 'articles page',
    html: '/tmpl/articleList.html',
    restricted: ['articleList'],
    scripts: [
        ['lib', 'app']
    ],
    styles: [
        ['lib', 'app']
    ]
}, {
    id: 'article',
    name: 'article page',
    html: '/tmpl/article.html',
    restricted: ['article'],
    scripts: [
        ['lib', 'app']
    ],
    styles: [
        ['lib', 'app']
    ]
}];