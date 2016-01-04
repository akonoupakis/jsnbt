var _ = require('underscore');

var PostParser = function (server) {
    this.server = server;
};

PostParser.prototype.process = function (ctx, postparsingContext, callback) {
    var self = this;

    var moduleFns = [];

    _.each(self.server.app.modules.all, function (module) {
        if (_.isObject(module.view) && _.isFunction(module.view.postparse))
            moduleFns.push(module.view.postparse);
    });

    var processModule = function () {

        var moduleFn = moduleFns.shift();
        if (moduleFn) {
            moduleFn(self.server, ctx, postparsingContext, function (postparsedContext) {
                processModule();
            });
        }
        else {
            callback(postparsingContext);
        }

    };

    processModule();

};

module.exports = function (server) {
    return new PostParser(server);
};