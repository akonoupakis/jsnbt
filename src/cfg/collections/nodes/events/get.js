var authMngr = requireApp('cms/authMngr.js')(server);
var node = requireApp('cms/nodeMngr.js')(server, db);

var _ = require('underscore');

var self = this;

if (!internal) {
    if (self.id) {

        if (!authMngr.isAuthorized(me, 'nodes:' + self.entity, 'R'))
            cancel('Access denied', 401);

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
            hide('layouts');

            hide('createdOn');
            hide('modifiedOn');
        }
    }
}