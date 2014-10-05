var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

var validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('');

var currentChars = self.key.split('');
_.each(currentChars, function (char) {
    if (validChars.indexOf(char) === -1)
        error('key', 'key invalid characters');
});
