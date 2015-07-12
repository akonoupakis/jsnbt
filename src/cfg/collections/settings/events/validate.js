var _ = require('underscore');

var self = this;

if (self.domain === 'core') {

    validate({
        type: 'object',
        properties: {
            data: {
                type: 'object',
                required: true,
                properties: {
                    homepage: { type: "string", required: true },
                    loginpage: { type: "string", required: server.app.restricted || false }
                }
            }
        }
    });

}