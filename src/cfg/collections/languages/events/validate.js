var _ = require('underscore');

validate({
    type: 'object',
    properties: {
        code: {
            type: "string",
            required: true,
            enum: _.pluck(server.jsnbt.languages, 'code')
        }
    }
});
