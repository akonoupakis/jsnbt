﻿/* global angular:false */

(function () {
    "use strict";

    var TextsController = function ($scope, $rootScope, $location, $logger, $q, $data, PagedDataService, ModalService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('TextsController');

        $scope.canCreate = function () {
            return true;
        };

        $scope.create = function () {
            $location.next('/content/texts/new');
        };

        $scope.gridFn = {

            canEdit: function (row) {
                return true;
            },

            edit: function (row) {
                $location.next('/content/texts/' + row.id);
            },

            canDelete: function (row) {
                return true;
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

    TextsController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        this.ctor.PagedDataService.get(this.ctor.$jsnbt.db.texts.get, {
            $sort: {
                group: 1,
                key: 1
            }
        }).then(function (response) {
            deferred.resolve(response);
        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('TextsController', ['$scope', '$rootScope', '$location', '$logger', '$q', '$data', 'PagedDataService', 'ModalService', TextsController]);
})();