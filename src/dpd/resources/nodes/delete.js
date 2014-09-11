var self = this;

dpd.nodeurls.get({ nodeId: self.id }, function (results, error) {
    if (error) {
        throw error;
    }
    else {
        var deleteNodeUrlIds = [];

        for (var i = 0; i < results.length; i++) {
            deleteNodeUrlIds.push(results[i].id);
        }

        dpd.nodeurls.del({ id: { $in: deleteNodeUrlIds } }, function (deleteResults, deleteError) {
            if(deleteError)
                throw deleteError;
        });
    }
});

dpd.drafts.get({ refId: self.id }, function (results, error) {
    if (error) {
        throw error;
    }
    else {
        var deleteDraftIds = [];

        for (var i = 0; i < results.length; i++) {
            deleteDraftIds.push(results[i].id);
        }

        dpd.drafts.del({ id: { $in: deleteDraftIds } }, function (deleteResults, deleteError) {
            if (deleteError)
                throw deleteError;
        });
    }
});