var auth = requireApp('auth.js');

var _ = require('underscore');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodes', 'D'))
    cancel('access denied', 500);

if (!internal)
    emit('nodeDeleted', self);