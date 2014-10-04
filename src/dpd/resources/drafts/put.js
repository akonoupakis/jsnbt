var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'drafts', 'U'))
    cancel('access denied', 500);

self.timestamp = new Date().getTime();

emit('draftUpdated', self);