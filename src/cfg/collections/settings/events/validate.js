module.exports = function (sender, context, data) {

    if (data.domain === 'core') {

        var errors = context.validate({
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    required: true,
                    properties: {
                        homepage: { type: "object", required: true }
                    }
                }
            }
        });

        if (errors)
            return context.error(errors);

    }

    context.done();

};