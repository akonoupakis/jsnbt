var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var _ = require('underscore');

var self = this;

var processFn = function () {

    if (!internal && !user.isAuthorized(me, 'texts', 'D'))
        cancel('access denied', 500);

    var drafts = dpdSync.call(dpd.drafts.get, { refId: self.id });
    if (drafts.length > 0) {
        var deleteDraftIds = _.pluck(drafts, 'id');
        dpdSync.call(dpd.drafts.del, { id: { $in: deleteDraftIds } });
    }

    if (!internal)
        emit('textDeleted', self);

};

dpdSync.wrap(processFn);