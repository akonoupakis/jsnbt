/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('PagedDataService', function ($q) {
            var PagedDataService = {};
            
            var userId = 'test';

            var getData = function (fn, query, start, limit, selected) {
                var deferred = $q.defer();

                if (!start)
                    start = 0;

                if (!limit)
                    limit = 50;

                if (limit > 1000)
                    limit = 1000;

                var qry = {
                    $sort: {
                        id: 1
                    }
                };
                angular.extend(qry, query, {
                    $skip: start,
                    $limit: limit
                });

                var params = [qry, function (results, error) {
                    if (error)
                        deferred.reject(error);
                    else {

                        var data = {
                            items: [],
                            more: function () {
                                return getData(fn, query, start + limit, limit, selected);
                            }
                        };
                        var resultIds = _.pluck(results, 'id');
                        dpd.drafts.get({ refId: { $in: resultIds }, user: userId }, function (draftResults, draftError) {
                            if (draftError)
                                deferred.reject(draftError);
                            else
                            {
                                $(results).each(function (r, result) {
                                    var drafts = _.filter(draftResults, function (x) { return x.refId === result.id; });
                                    result.$parent = data;
                                    result.selected = selected !== undefined && selected.indexOf(result.id) !== -1;
                                    result.draft = drafts.length > 0;
                                    data.items.push(result);
                                });

                                deferred.resolve(data);
                            }
                        });
                    }
                }];
                fn.apply(fn, params);

                return deferred.promise;
            };

            PagedDataService.get = function (fn, query, start, limit, selected) {
                var deferred = $q.defer();

                getData(fn, query, start, limit, selected).then(function (results) {
                    deferred.resolve(results);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            return PagedDataService;
        });
})();