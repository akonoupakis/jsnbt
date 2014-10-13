var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var _ = require('underscore');

var self = this;

if (!internal && !user.isAuthorized(me, 'texts', 'D'))
    cancel('access denied', 500);

if (!internal)
    emit('textDeleted', self);