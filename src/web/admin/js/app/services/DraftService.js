/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('DraftService', function ($q, $data) {
            var DraftService = {};
            
            var userId = 'test';

            DraftService.set = function (collection, id, data) {
                var deferred = $q.defer();

                dpd.drafts.get({
                    refId: id,
                    collection: collection,
                    user: userId
                }, function (results, error) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        var resultIds = _.pluck(results, 'id');
                        if (resultIds.length > 0) {
                            dpd.drafts.del({
                                id: {
                                    $in: resultIds
                                }
                            }, function (delResults, delError) {
                                if (delError) {
                                    deferred.reject(delError);
                                }
                                else {
                                    dpd.drafts.post($data.create('drafts', {
                                        refId: id,
                                        collection: collection,
                                        data: data,
                                        user: userId
                                    }), function (addResponse, addError) {
                                        if (addError)
                                            deferred.reject(addError);
                                        else
                                            deferred.resolve(addResponse.data);
                                    });
                                }
                            });
                        }
                        else {
                            dpd.drafts.post($data.create('drafts', {
                                refId: id,
                                collection: collection,
                                data: data,
                                user: userId
                            }), function (addResponse, addError) {
                                if (addError)
                                    deferred.reject(addError);
                                else
                                    deferred.resolve(addResponse.data);
                            });
                        }
                    }
                });

                return deferred.promise;
            };

            DraftService.get = function (collection, id) {
                var deferred = $q.defer();

                dpd.drafts.get({
                    refId: id,
                    collection: collection,
                    user: userId,
                    $sort: {
                        timestamp: -1
                    },
                    $limit: 1
                }, function (results, error) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        var result = (_.first(results) || {}).data;
                        deferred.resolve(result);
                    }
                });

                return deferred.promise;
            };

            DraftService.clear = function (collection, id) {
                var deferred = $q.defer();

                dpd.drafts.get({
                    refId: id,
                    collection: collection,
                    user: userId
                }, function (results, error) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        var resultIds = _.pluck(results, 'id');
                        if (resultIds.length > 0) {
                            dpd.drafts.del({
                                id: {
                                    $in: resultIds
                                }
                            }, function (delResults, delError) {
                                if (delError) {
                                    deferred.reject(delError);
                                }
                                else {
                                    deferred.resolve();
                                }
                            });
                        }
                        else {
                            deferred.resolve();
                        }
                    }
                });

                return deferred.promise;
            };

            return DraftService;
        });
})();