var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'drafts', 'C'))
    cancel('access denied', 500);

self.timestamp = new Date().getTime();

if (!internal)
    emit('draftCreated', self);