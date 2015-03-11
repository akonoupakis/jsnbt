var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'R'))
    cancel('access denied', 500);

if (!internal) {

    if (self.id) {
        if (!auth.isInRole(me, 'admin')) {
            hide('createdOn');
            hide('modifiedOn');
            hide('published');
        }
    }

}