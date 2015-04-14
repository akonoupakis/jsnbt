var auth = requireApp('auth.js');
var node = requireApp('node.js')(dpd);
var jsnbt = requireApp('jsnbt.js');

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

        if (!auth.isInRole(me, 'admin')) {
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