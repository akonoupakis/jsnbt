module.exports = [{
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
}];