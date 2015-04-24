var fs = require("fs");

module.exports = [{
    name: "actions",
    properties: require("./collections/actions/properties.json"),
    logging: false
}, {
    name: "data",
    properties: require("./collections/data/properties.json"),
    permissions: require("./collections/data/permissions.json"),
    logging: true,
    getEvents: function () {
        return {
            get: fs.readFileSync(__dirname + "/collections/data/events/get.js", "utf8"),
            validate: fs.readFileSync(__dirname + "/collections/data/events/validate.js", "utf8"),
            post: fs.readFileSync(__dirname + "/collections/data/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/data/events/put.js", "utf8")
        }
    }
}, {
    name: "languages",
    properties: require("./collections/languages/properties.json"),
    permissions: require("./collections/languages/permissions.json"),
    logging: true,
    getEvents: function () {
        return {
            validate: fs.readFileSync(__dirname + "/collections/languages/events/validate.js", "utf8"),
            post: fs.readFileSync(__dirname + "/collections/languages/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/languages/events/put.js", "utf8"),
            delete: fs.readFileSync(__dirname + "/collections/languages/events/delete.js", "utf8")
        }
    }
}, {
    name: "layouts",
    properties: require("./collections/layouts/properties.json"),
    permissions: require("./collections/layouts/permissions.json"),
    logging: true,
    getEvents: function () {
        return {
            validate: fs.readFileSync(__dirname + "/collections/layouts/events/validate.js", "utf8"),
            post: fs.readFileSync(__dirname + "/collections/layouts/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/layouts/events/put.js", "utf8")
        }
    }
}, {
    name: "migrations",
    properties: require("./collections/migrations/properties.json"),
    logging: false
}, {
    name: "nodes",
    properties: require("./collections/nodes/properties.json"),
    permissions: require("./collections/nodes/permissions.json"),
    logging: true,
    getEvents: function () {
        return {
            get: fs.readFileSync(__dirname + "/collections/nodes/events/get.js", "utf8"),
            validate: fs.readFileSync(__dirname + "/collections/nodes/events/validate.js", "utf8"),
            post: fs.readFileSync(__dirname + "/collections/nodes/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/nodes/events/put.js", "utf8"),
            delete: fs.readFileSync(__dirname + "/collections/nodes/events/delete.js", "utf8")
        }
    }
}, {
    name: "settings",
    properties: require("./collections/settings/properties.json"),
    permissions: require("./collections/settings/permissions.json"),
    logging: true,
    getEvents: function () {
        return {
            post: fs.readFileSync(__dirname + "/collections/settings/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/settings/events/put.js", "utf8")
        }
    }
}, {
    name: "texts",
    properties: require("./collections/texts/properties.json"),
    permissions: require("./collections/texts/permissions.json"),
    logging: true,
    getEvents: function () {
        return {
            validate: fs.readFileSync(__dirname + "/collections/texts/events/validate.js", "utf8"),
            post: fs.readFileSync(__dirname + "/collections/texts/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/texts/events/put.js", "utf8")
        }
    }
}, {
    name: "users",
    properties: require("./collections/users/properties.json"),
    permissions: false,
    logging: false,
    users: true,
    getEvents: function () {
        return {
            get: fs.readFileSync(__dirname + "/collections/users/events/get.js", "utf8"),
            validate: fs.readFileSync(__dirname + "/collections/users/events/validate.js", "utf8"),
            post: fs.readFileSync(__dirname + "/collections/users/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/users/events/put.js", "utf8"),
            delete: fs.readFileSync(__dirname + "/collections/users/events/delete.js", "utf8")
        }
    }
}];