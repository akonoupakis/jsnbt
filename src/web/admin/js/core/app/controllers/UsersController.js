/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('UsersController', ['$scope', '$location', '$logger', '$q', 'PagedDataService', function ($scope, $location, $logger, $q, PagedDataService) {
            
            var logger = $logger.create('UsersController');

            $scope.data = {};


            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    PagedDataService.get(dpd.users.get, {}).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                create: function () {
                    var deferred = $q.defer();
                    
                    deferred.reject(new Error('not implemented'));

                    return deferred.promise;
                }

            };


            $scope.create = function () {
                fn.create().then(function (result) {
                    $location.next('/users/' + result.id);
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.gridFn = {

                edit: function (user) {
                    $location.next('/users/' + user.id);
                }

            };


            fn.load().then(function (response) {
                $scope.data = response;
            }, function (ex) {
                logger.error(ex);
            });

        }]);
})(); 