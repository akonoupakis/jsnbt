var authMngr = requireApp('cms/authMngr.js')(server);
var node = requireApp('cms/nodeMngr.js')(server, db);

var _ = require('underscore');

var self = this;

if (!internal) {
    if (self.id) {
        node.buildUrl(self, function (response) {
            self.url = response;
        });

        node.getActiveInfo(self, function (response) {
            self.enabled = response;
        });

        if (!authMngr.isInRole(me, 'admin')) {
            hide('roles');
            hide('robots');
            hide('template');
            hide('meta');
            hide('layout');

            hide('createdOn');
            hide('modifiedOn');
        }
    }
}