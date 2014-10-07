var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'nodeurls', 'D'))
    cancel('access denied', 500);

emit('nodeurlDeleted', self);