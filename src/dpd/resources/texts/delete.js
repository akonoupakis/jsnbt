var dpdSync = require('dpd-sync');
var auth = requireApp('auth.js');

var _ = require('underscore');

var self = this;

if (!internal && !auth.isAuthorized(me, 'texts', 'D'))
    cancel('access denied', 500);

if (!internal)
    emit('textDeleted', self);