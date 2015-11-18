var authMngr = requireApp('cms/authMngr.js')(server);

var self = this;

if (!internal) {

    if (self.id) {

        if (!authMngr.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'R'))
            cancel('Access denied', 401);

        if (!authMngr.isInRole(me, 'admin')) {
            hide('createdOn');
            hide('modifiedOn');
        }

    }

}