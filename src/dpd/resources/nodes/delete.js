var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var _ = require('underscore');

var self = this;

var processFn = function () {

    if (!internal && !user.isAuthorized(me, 'nodes', 'D'))
        cancel('access denied', 500);

    var nodeUrls = dpdSync.call(dpd.nodeurls.get, { nodeId: self.id });
    if (nodeUrls.length > 0) {
        var deleteNodeUrlIds = _.pluck(nodeUrls, 'id');
        dpdSync.call(dpd.nodeurls.del, { id: { $in: deleteNodeUrlIds } });
    }

    var drafts = dpdSync.call(dpd.drafts.get, { refId: self.id });
    if (drafts.length > 0) {
        var deleteDraftIds = _.pluck(drafts, 'id');
        dpdSync.call(dpd.drafts.del, { id: { $in: deleteDraftIds } });
    }

    if (!internal)
        emit('nodeDeleted', self);

};

dpdSync.wrap(processFn);