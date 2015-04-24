module.exports = [{
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
}];

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