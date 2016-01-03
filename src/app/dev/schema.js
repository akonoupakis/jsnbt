var SchemaHandler = function (server) {
    this.server = server;
}

SchemaHandler.prototype.route = function (ctx, next) {

    if (ctx.uri.parts.length > 2) {

        var schemaName = ctx.uri.parts[2];
        if (schemaName.toLowerCase() === 'config') {
            var schema = require('../../cfg/schema.json');
            ctx.json(schema);
        }
        else {
            next();
        }

    }
    else {
        next();
    }

};

module.exports = function (server) {
    return new SchemaHandler(server);
};