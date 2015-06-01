var self = this;

validate({
    type: 'object',
    properties: {
        roles: {
            type: "array",
            required: true,
            items: { type: "string" },
            enum: _.pluck(server.jsnbt.roles, 'name'),
            uniqueItems: true
        }
    }
});

if (!self.username.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i)) {
    error('username', 'not a valid email');
}