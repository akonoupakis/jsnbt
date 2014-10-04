var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'drafts', 'C'))
    cancel('access denied', 500);

self.timestamp = new Date().getTime();

emit('draftCreated', self);