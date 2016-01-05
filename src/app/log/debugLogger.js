var DebugLogger = function () {
    this.messages = [];
};

DebugLogger.prototype.log = function (text) {
    this.messages.push(text);
};

DebugLogger.prototype.get = function () {
    return this.messages;
};

module.exports = function () {
    return new DebugLogger();
};