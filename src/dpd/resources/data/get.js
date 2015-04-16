var authMngr = requireApp('cms/authMngr.js')(server);

var self = this;

if (!internal) {

    if (self.id) {
        if (!authMngr.isInRole(me, 'admin')) {
            hide('createdOn');
            hide('modifiedOn');
        }
    }

}