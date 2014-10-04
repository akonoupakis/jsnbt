var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'drafts', 'D'))
    cancel('access denied', 500);

emit('draftDeleted', self);