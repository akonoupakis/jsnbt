var fs = require("fs");

module.exports = [{
    name: "actions",
    schema: require("./collections/actions/schema.json"),
    logging: false,
    events: {
        validate: fs.readFileSync(__dirname + "/collections/actions/events/validate.js", "utf8")        
    }
}, {
    name: "data",
    schema: require("./collections/data/schema.json"),
    permissions: require("./collections/data/permissions.json"),
    logging: true,
    events: {
        get: fs.readFileSync(__dirname + "/collections/data/events/get.js", "utf8"),
        validate: fs.readFileSync(__dirname + "/collections/data/events/validate.js", "utf8"),
        post: fs.readFileSync(__dirname + "/collections/data/events/post.js", "utf8"),
        put: fs.readFileSync(__dirname + "/collections/data/events/put.js", "utf8")
    }
}, {
    name: "languages",
    schema: require("./collections/languages/schema.json"),
    permissions: require("./collections/languages/permissions.json"),
    logging: true,
    events: {
        validate: fs.readFileSync(__dirname + "/collections/languages/events/validate.js", "utf8"),
        post: fs.readFileSync(__dirname + "/collections/languages/events/post.js", "utf8"),
        put: fs.readFileSync(__dirname + "/collections/languages/events/put.js", "utf8"),
        delete: fs.readFileSync(__dirname + "/collections/languages/events/delete.js", "utf8")
    }
}, {
    name: "layouts",
    schema: require("./collections/layouts/schema.json"),
    permissions: require("./collections/layouts/permissions.json"),
    logging: true,
    events: {
        validate: fs.readFileSync(__dirname + "/collections/layouts/events/validate.js", "utf8"),
        post: fs.readFileSync(__dirname + "/collections/layouts/events/post.js", "utf8"),
        put: fs.readFileSync(__dirname + "/collections/layouts/events/put.js", "utf8")
    }
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
        get: fs.readFileSync(__dirname + "/collections/nodes/events/get.js", "utf8"),
        validate: fs.readFileSync(__dirname + "/collections/nodes/events/validate.js", "utf8"),
        post: fs.readFileSync(__dirname + "/collections/nodes/events/post.js", "utf8"),
        put: fs.readFileSync(__dirname + "/collections/nodes/events/put.js", "utf8"),
        delete: fs.readFileSync(__dirname + "/collections/nodes/events/delete.js", "utf8")
    }
}, {
    name: "settings",
    schema: require("./collections/settings/schema.json"),
    permissions: require("./collections/settings/permissions.json"),
    logging: true,
    events: {
        validate: fs.readFileSync(__dirname + "/collections/settings/events/validate.js", "utf8"),
        post: fs.readFileSync(__dirname + "/collections/settings/events/post.js", "utf8"),
        put: fs.readFileSync(__dirname + "/collections/settings/events/put.js", "utf8")
    }
}, {
    name: "texts",
    schema: require("./collections/texts/schema.json"),
    permissions: require("./collections/texts/permissions.json"),
    logging: true,
    events: {
        validate: fs.readFileSync(__dirname + "/collections/texts/events/validate.js", "utf8"),
        post: fs.readFileSync(__dirname + "/collections/texts/events/post.js", "utf8"),
        put: fs.readFileSync(__dirname + "/collections/texts/events/put.js", "utf8")
    }
}, {
    name: "users",
    schema: require("./collections/users/schema.json"),
    permissions: false,
    logging: false,
    users: true,
    events: {
        get: fs.readFileSync(__dirname + "/collections/users/events/get.js", "utf8"),
        validate: fs.readFileSync(__dirname + "/collections/users/events/validate.js", "utf8"),
        post: fs.readFileSync(__dirname + "/collections/users/events/post.js", "utf8"),
        put: fs.readFileSync(__dirname + "/collections/users/events/put.js", "utf8"),
        delete: fs.readFileSync(__dirname + "/collections/users/events/delete.js", "utf8")
    }
}];