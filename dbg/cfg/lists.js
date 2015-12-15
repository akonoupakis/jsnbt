module.exports = [{
    id: 'telephones',
    name: 'Telephones',
    form: 'tmpl/public/forms/list/telephones.html'
}, {
    id: 'telephones2',
    name: 'Telephones 2',
    form: 'tmpl/public/forms/list/telephones.html',
    localized: false,
    permissions: [{
        role: 'admin',
        crud: ['C', 'R']
    }]
}];