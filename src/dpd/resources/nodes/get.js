var auth = requireApp('auth.js');
var node = requireApp('node.js')(dpd);
var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodes', 'R')) {
    cancel('access denied', 500);
}

if (!internal) {
    if (self.id) {
        node.buildUrl(self, function (response) {
            self.url = response;
        });

        node.getActiveInfo(self, function (response) {
            self.enabled = response;
        });

        if (!auth.isInRole(me, 'admin')) {
            hide('roles');
            hide('robots');
            hide('template');
            hide('meta');

            hide('createdOn');
            hide('modifiedOn');
            hide('published');
        }
    }
}