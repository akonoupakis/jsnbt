/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('DraftService', function ($q, $data, $session) {
            var DraftService = {};
            
            DraftService.set = function (collection, id, data) {
                var deferred = $q.defer();

                dpd.drafts.get({
                    refId: id,
                    collection: collection,
                    user: $session.user.id
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
                                        user: $session.user.id
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
                                user: $session.user.id
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
                    user: $session.user.id,
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
                    user: $session.user.id
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

            DraftService.patch = function (collection, data) {
                var deferred = $q.defer();

                var dataIds = _.pluck(data, 'id');

                dpd.drafts.get({
                    refId: {
                        $in: dataIds
                    },
                    collection: collection,
                    user: $session.user.id,
                    $sort: {
                        timestamp: -1
                    }
                }, function (results, error) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        var newData = [];

                        $(data).each(function (d, datum) {
                            var matched = _.first(_.filter(results, function (x) { return x.refId == datum.id; }));
                            var newDatum = {};
                            
                            if (matched) {
                                $.extend(true, newDatum, matched.data);
                            }
                            else {
                                $.extend(true, newDatum, datum);
                            }

                            newData.push(newDatum);
                        });

                        deferred.resolve(newData);
                    }
                });

                return deferred.promise;
            }

            return DraftService;
        });
})();