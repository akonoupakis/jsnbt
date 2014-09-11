/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodesController', function ($scope, $location, $rootScope, $route, $logger, $q, $data, TreeNodeService, $fn, LocationService) {
            
            var logger = $logger.create('TextsController');

            $scope.domain = 'core';
            $scope.nodes = [];
            

            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    TreeNodeService.getNodes({
                        identifier: 'content:nodes',
                        domain: $scope.domain,
                        parentId: '',
                        parentIds: []
                    }).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                create: function () {
                    var deferred = $q.defer();

                    $fn.invoke('core', 'tree.create', [undefined]).then(function (result) {
                        deferred.resolve(result);
                        $location.next('/content/nodes/' + result.id);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }

            };


            $scope.back = function () {
                $location.previous('/content');
            };

            $scope.create = function () {
                fn.create().then(function (result) {
                    $location.next('/content/nodes/' + result.id);
                }, function (ex) {
                    logger.error(ex);
                });
            };


            fn.load().then(function (response) {
                $scope.nodes = response;
            }, function (ex) {
                logger.error(ex);
            });

        });
})();