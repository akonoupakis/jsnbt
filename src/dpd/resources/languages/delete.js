var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'languages', 'D'))
    cancel('access denied', 500);

if (this.default)
    error('default', "is default and cannot be deleted");

if (!internal)
    emit('languageDeleted', self);