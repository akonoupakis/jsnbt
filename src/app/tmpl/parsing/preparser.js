var _ = require('underscore');

var PreParser = function (server) {
    this.server = server;
};

PreParser.prototype.process = function (ctx, preparsingContext, callback) {
    var self = this;

    var moduleFns = [];

    _.each(self.server.app.modules.all, function (module) {
        if (_.isObject(module.view) && _.isFunction(module.view.preparse)) {
            moduleFns.push(module.view.preparse);
        }
    });

    var processModule = function () {

        var moduleFn = moduleFns.shift();
        if (moduleFn) {
            moduleFn(self.server, ctx, preparsingContext, function (preparsedContext) {
                processModule();
            });
        }
        else {
            callback(preparsingContext);
        }

    };

    processModule();
};

module.exports = function (server) {
    return new PreParser(server);
};