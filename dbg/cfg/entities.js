module.exports = [
    {
        name: 'course',
        properties: {
            tutors: false
        },
        permissions: [{
            role: 'admin',
            crud: ['C', 'R']
        }]
    }
];