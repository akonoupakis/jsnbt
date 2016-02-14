/* global angular:false */

(function () {
    "use strict";

    var TextsController = function ($scope, $rootScope, $location, $logger, $q, $data, PagedDataService, ModalService, AuthService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('TextsController');

        $scope.canCreate = function () {
            return AuthService.isAuthorized($scope.current.user, 'texts', 'C');
        };

        $scope.create = function () {
            $location.next('/content/texts/new');
        };

        $scope.gridFn = {

            canEdit: function (row) {
                return AuthService.isAuthorized($scope.current.user, 'texts', 'U');
            },

            edit: function (row) {
                $location.next('/content/texts/' + row.id);
            },

            canDelete: function (row) {
                return AuthService.isAuthorized($scope.current.user, 'texts', 'D');
            },

            delete: function (row) {

                ModalService.confirm(function (x) {
                    x.title('are you sure you want to delete the key ' + row.key + '?');
                }).then(function (confirmed) {
                    if (confirmed) {
                        $data.texts.del(row.id).then(function () {
                            self.remove(row);
                        }, function (ex) {
                            deferred.reject(ex);
                        });
                    }
                });
            }

        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    TextsController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    TextsController.prototype.load = function (filters, sorter) {
        var deferred = this.ctor.$q.defer();

        this.ctor.PagedDataService.get({
            fn: this.ctor.$jsnbt.db.texts, 
            query: {
                $sort: {
                    group: 1,
                    key: 1
                }
            },
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
        .controller('TextsController', ['$scope', '$rootScope', '$location', '$logger', '$q', '$data', 'PagedDataService', 'ModalService', 'AuthService', TextsController]);
})();