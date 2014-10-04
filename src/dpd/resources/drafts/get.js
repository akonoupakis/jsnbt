var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'drafts', 'R'))
    cancel('access denied', 500);