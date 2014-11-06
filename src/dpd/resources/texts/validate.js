var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

var keyValidChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('');

var currentChars = self.key.split('');
_.each(currentChars, function (char) {
    if (keyValidChars.indexOf(char) === -1)
        error('key', 'key invalid characters');
});


var groupValidChars = 'abcdefghijklmnopqrstuvwxyz_'.split('');

var currentGroupChars = self.group.split('');
_.each(currentGroupChars, function (char) {
    if (groupValidChars.indexOf(char) === -1)
        error('group', 'group invalid characters');
});
