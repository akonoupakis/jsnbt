/* global angular:false */

(function () {
    "use strict";

    var UsersController = function ($scope, $rootScope, $location, $logger, $q, $jsnbt, PagedDataService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('UsersController');

        $scope.canCreate = function () {
            return true;
        };

        $scope.create = function () {
            $location.next('/users/new');
        };

        $scope.gridFn = {

            sort: function (name, direction) {
                var sort = {};
                sort[name] = direction === 'asc' ? 1 : -1;
                PagedDataService.get($jsnbt.db.users.get, {
                    $sort: sort
                }).then(function (response) {
                    $scope.model = response;
                }).catch(function (error) {
                    throw error;
                });
            },

            filter: function (filters) {

            },

            canEdit: function (user) {
                return true;
            },

            edit: function (user) {
                $location.next('/users/' + user.id);
            }

        };
        
        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    UsersController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    UsersController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        this.ctor.PagedDataService.get(this.ctor.$jsnbt.db.users.get, { }).then(function (response) {
            deferred.resolve(response);
        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('UsersController', ['$scope', '$rootScope', '$location', '$logger', '$q', '$jsnbt', 'PagedDataService', UsersController]);
})(); 