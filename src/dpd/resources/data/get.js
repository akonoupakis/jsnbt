var self = this;

if (!internal) {

    if (self.id) {
        if (!auth.isInRole(me, 'admin')) {
            hide('createdOn');
            hide('modifiedOn');
        }
    }

}