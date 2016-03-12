module.exports = [{
    id: 'telephones',
    name: 'Telephones',
    form: '/tmpl/public/forms/list/telephones.html'
}, {
    id: 'telephoness',
    name: 'Telephones 2',
    form: '/tmpl/public/forms/list/telephones.html',
    localized: false,
    permissions: [{
        role: 'admin',
        crud: ['C', 'R']
    }]
}, {
    id: 'feeds',
    name: 'Feeds',
    list: '/admin/tmpl/public/forms/list/feedsList.html',
    form: '/admin/tmpl/public/forms/list/feeds.html',
    localized: false
}];