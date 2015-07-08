/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('PagedDataService', ['$q', function ($q) {
            var PagedDataService = {};
            
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

                        $(results).each(function (r, result) {
                            result.$parent = data;
                            result.selected = selected !== undefined && selected.indexOf(result.id) !== -1;
                            data.items.push(result);
                        });

                        deferred.resolve(data);
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
        }]);
})();