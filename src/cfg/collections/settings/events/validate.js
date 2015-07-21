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
                    homepage: { type: "string", required: true }
                }
            }
        }
    });

}