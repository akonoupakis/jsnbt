module.exports = {
    mail: {
        templates: [{
            code: 'registration',
            model: {
                firstName: 'John',
                lastName: 'Doe'
            },
            subject: 'Helllo {{ firstName }}, you have just registered with jsnbt',
            body: 'Helllo {{ firstName }}, you <b>have just</b> registered with jsnbt'
        }]
    },
    sms: {
        templates: [{
            code: 'registration',
            model: {
                firstName: 'John',
                lastName: 'Doe'
            },
            body: 'Helllo {{ firstName }}, you have just registered with jsnbt'
        }]
    }
};