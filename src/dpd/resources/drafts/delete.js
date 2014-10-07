var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'drafts', 'D'))
    cancel('access denied', 500);

if (!internal)
    emit('draftDeleted', self);