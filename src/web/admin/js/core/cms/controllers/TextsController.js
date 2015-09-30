/* global angular:false */

(function () {
    "use strict";

    var TextsController = function ($scope, $location, $logger, $q, $data, PagedDataService, ModalService) {
        jsnbt.ListControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('TextsController');
        
        $scope.load = function () {
            var deferred = $q.defer();

            PagedDataService.get(jsnbt.db.texts.get, {
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

                ModalService.open({
                    title: 'are you sure you want to delete the key ' + row.key + '?',
                    controller: 'DeletePromptController',
                    template: 'tmpl/core/modals/deletePrompt.html'
                }).then(function (confirmed) {
                    if (confirmed) {
                        $data.texts.del(row.id).then(function () {
                            $scope.remove(row);
                        }, function (ex) {
                            deferred.reject(ex);
                        });
                    }
                });
            }

        };

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    TextsController.prototype = Object.create(jsnbt.ListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('TextsController', ['$scope', '$location', '$logger', '$q', '$data', 'PagedDataService', 'ModalService', TextsController]);
})();