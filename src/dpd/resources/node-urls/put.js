var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'nodeurls', 'U'))
    cancel('access denied', 500);

emit('nodeurlUpdated', self);