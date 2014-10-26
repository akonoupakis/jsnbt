var auth = requireApp('auth.js');

var _ = require('underscore');

var self = this;

if (!internal && !auth.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'D'))
    cancel('access denied', 500);

if (!internal)
    emit('dataDeleted', self);