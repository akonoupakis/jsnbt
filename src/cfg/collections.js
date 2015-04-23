var fs = require("fs");

module.exports = [{
    name: "actions",
    properties: require("./collections/actions/properties.json")
}, {
    name: "data",
    properties: require("./collections/data/properties.json"),
    permissions: require("./collections/data/permissions.json"),
    getEvents: function () {
        return {
            get: fs.readFileSync(__dirname + "/collections/data/events/get.js", "utf8"),
            validate: fs.readFileSync(__dirname + "/collections/data/events/validate.js", "utf8"),
            post: fs.readFileSync(__dirname + "/collections/data/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/data/events/put.js", "utf8")
        }
    }
}, {
    name: "nodes",
    properties: require("./collections/nodes/properties.json"),
    permissions: require("./collections/nodes/permissions.json"),
    getEvents: function () {
        return {
            get: fs.readFileSync(__dirname + "/collections/nodes/events/get.js", "utf8"),
            validate: fs.readFileSync(__dirname + "/collections/nodes/events/validate.js", "utf8"),
            post: fs.readFileSync(__dirname + "/collections/nodes/events/post.js", "utf8"),
            put: fs.readFileSync(__dirname + "/collections/nodes/events/put.js", "utf8"),
            delete: fs.readFileSync(__dirname + "/collections/nodes/events/delete.js", "utf8")
        }
    }
}];