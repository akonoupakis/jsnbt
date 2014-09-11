var self = this;

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