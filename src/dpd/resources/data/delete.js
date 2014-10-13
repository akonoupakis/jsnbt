var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var _ = require('underscore');

var self = this;

if (!internal && !user.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'D'))
    cancel('access denied', 500);

if (!internal)
    emit('dataDeleted', self);