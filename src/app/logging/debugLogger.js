var DebugLogger = function () {

    var messages = [];

    return {

        log: function (text) {
            messages.push(text);
            console.log(text);
        },

        get: function () {
            return messages;
        }

    };

};

module.exports = DebugLogger;