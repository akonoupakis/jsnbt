var _ = require('underscore');

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