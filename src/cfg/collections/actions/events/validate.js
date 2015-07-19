var _ = require('underscore');

console.log('val ac');

validate({
    type: 'object',
    properties: {
        collection: {
            type: "string",
            required: true,
            enum: _.keys(server.app.config.collections)
        }
    }
});