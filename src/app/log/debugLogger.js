var Logger = function () {
    this.messages = [];
};

Logger.prototype.log = function (text) {
    this.messages.push(text);
};

Logger.prototype.get = function () {
    return this.messages;
};

module.exports = function () {
    return new Logger();
};