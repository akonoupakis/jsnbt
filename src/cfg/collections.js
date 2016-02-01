module.exports = [{
    name: "actions",
    schema: require("./collections/actions/schema.json"),
    logging: false,
    events: {
        validate: require("./collections/actions/events/validate.js")
    }
}, {
    name: "data", 
    schema: require("./collections/data/schema.json"),
    permissions: require("./collections/data/permissions.json"),
    logging: true,
    events: {
        get: require("./collections/data/events/get.js"),
        validate: require("./collections/data/events/validate.js"),
        post: require("./collections/data/events/post.js"),
        put: require("./collections/data/events/put.js"),
        delete: require("./collections/data/events/delete.js")
    },
    default: require('./collections/data/default.json')
}, {
    name: "languages",
    schema: require("./collections/languages/schema.json"),
    permissions: require("./collections/languages/permissions.json"),
    logging: true,
    events: {
        validate: require("./collections/languages/events/validate.js"),
        post: require("./collections/languages/events/post.js"),
        put: require("./collections/languages/events/put.js"),
        delete: require("./collections/languages/events/delete.js")
    },
    default: require('./collections/languages/default.json')
}, {
    name: "layouts",
    schema: require("./collections/layouts/schema.json"),
    permissions: require("./collections/layouts/permissions.json"),
    logging: true,
    events: {
        validate: require("./collections/layouts/events/validate.js"),
        post: require("./collections/layouts/events/post.js"),
        put: require("./collections/layouts/events/put.js")
    },
    default: require('./collections/layouts/default.json')
}, {
    name: "migrations",
    schema: require("./collections/migrations/schema.json"),
    logging: false
}, {
    name: "nodes",
    schema: require("./collections/nodes/schema.json"),
    permissions: require("./collections/nodes/permissions.json"),
    logging: true,
    events: {
        get: require("./collections/nodes/events/get.js"),
        validate: require("./collections/nodes/events/validate.js"),
        post: require("./collections/nodes/events/post.js"),
        put: require("./collections/nodes/events/put.js"),
        delete: require("./collections/nodes/events/delete.js")
    },
    default: require('./collections/nodes/default.json')
}, {
    name: "settings",
    schema: require("./collections/settings/schema.json"),
    permissions: require("./collections/settings/permissions.json"),
    logging: true,
    events: {
        validate: require("./collections/settings/events/validate.js"),
        post: require("./collections/settings/events/post.js"),
        put: require("./collections/settings/events/put.js")
    },
    default: require('./collections/settings/default.json')
}, {
    name: "texts",
    schema: require("./collections/texts/schema.json"),
    permissions: require("./collections/texts/permissions.json"),
    logging: true,
    events: {
        validate: require("./collections/texts/events/validate.js"),
        post: require("./collections/texts/events/post.js"),
        put: require("./collections/texts/events/put.js")
    },
    default: require('./collections/texts/default.json')
}, {
    name: "messages",
    schema: require("./collections/messages/schema.json"),
    permissions: require("./collections/messages/permissions.json"),
    default: require('./collections/messages/default.json')
}, {
    name: "users",
    schema: require("./collections/users/schema.json"),
    permissions: false,
    logging: false,
    //users: true,
    events: {
        get: require("./collections/users/events/get.js"),
        resolve: require("./collections/users/events/resolve.js"),
        validate: require("./collections/users/events/validate.js"),
        post: require("./collections/users/events/post.js"),
        put: require("./collections/users/events/put.js"),
        delete: require("./collections/users/events/delete.js")
    },
    default: require('./collections/users/default.json')
}];