/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('DpdService', function ($q) {
            var DpdService = {};

            DpdService.call = function () {
                var deferred = $q.defer();

                var fn = _.first(arguments);
                var params = _.toArray(arguments).slice(1);
                params.push(function (result, error) {
                    if (result)
                        deferred.resolve(result);
                    else
                        deferred.reject(result);
                });

                fn.apply(fn, params);

                return deferred.promise;
            };

            return DpdService;
        });
})();