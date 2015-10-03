/* global angular:false */

(function () {
    "use strict";

    var UsersController = function ($scope, $rootScope, $location, $logger, $q, PagedDataService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('UsersController');

        $scope.load = function () {
            var deferred = $q.defer();

            PagedDataService.get(jsnbt.db.users.get, {
                $sort: {
                    lastName: 1
                }
            }).then(function (response) {
                deferred.resolve(response);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        $scope.canCreate = function () {
            return false;
        };

        $scope.create = function () {
            $location.next('/users/new');
        };

        $scope.gridFn = {

            canEdit: function (user) {
                return true;
            },

            edit: function (user) {
                $location.next('/users/' + user.id);
            }

        };
        
        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    UsersController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('UsersController', ['$scope', '$rootScope', '$location', '$logger', '$q', 'PagedDataService', UsersController]);
})(); 