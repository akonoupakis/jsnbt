module.exports = [{
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
}];