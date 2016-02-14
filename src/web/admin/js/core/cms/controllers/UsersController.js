/* global angular:false */

(function () {
    "use strict";

    var UsersController = function ($scope, $rootScope, $location, $logger, $q, $jsnbt, PagedDataService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('UsersController');

        $scope.canCreate = function () {
            return true;
        };

        $scope.create = function () {
            $location.next('/users/new');
        };

        $scope.gridFn = {
            load: function (filters, sorter) {
                self.load(filters, sorter).then(function (response) {
                    $scope.model = response;
                }).catch(function (error) {
                    throw error;
                });
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

    UsersController.prototype.load = function (filters, sorter) {
        var deferred = this.ctor.$q.defer();
        
        this.ctor.PagedDataService.get({
            fn: this.ctor.$jsnbt.db.users,
            query: { },
            filters: filters,
            sorter: sorter
        }).then(function (response) {
            deferred.resolve(response);
        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('UsersController', ['$scope', '$rootScope', '$location', '$logger', '$q', '$jsnbt', 'PagedDataService', UsersController]);
})(); 