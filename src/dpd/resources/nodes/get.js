var auth = requireApp('auth.js');
var node = requireApp('node.js')(dpd);
var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodes', 'R')) {
    cancel('access denied', 500);
}

if (!internal) {

    //node.buildUrl(self, function (response) {
    //    self.link = response;
    //});
    
    //hide('config');

    //if (!auth.isInRole(me, 'admin')) {
    //    hide('permissions');
    //}

}