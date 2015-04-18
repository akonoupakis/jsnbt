/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('StoresController', function ($scope, $q) {

            $scope.stores = [];

            var loadStores = function () {
                var deferred = $q.defer();

                dpd.nodeurls.get({
                    language: $scope.language,
                    hierarchy: $scope.pageId,
                    nodeId: {
                        $nin: [$scope.pageId]
                    }
                }, function (results, error) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        deferred.resolve(results);
                    }
                });

                return deferred.promise;
            };

            loadStores().then(function (response) {
                $scope.stores = response;
                console.log('stores', response);
            }, function (ex) {
                throw ex;
            });

        });
})();