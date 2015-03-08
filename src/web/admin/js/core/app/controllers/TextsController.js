/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TextsController', function ($scope, $location, $logger, $q, $data, PagedDataService, ModalService, LocationService) {
           
            var logger = $logger.create('TextsController');

            $scope.data = {};
            

            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    PagedDataService.get(dpd.texts.get, {}).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                delete: function (data) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'are you sure you want to delete the key ' + data.key + '?',
                        controller: 'DeletePromptController',
                        template: 'tmpl/core/modals/deletePrompt.html'
                    }).then(function (confirmed) {
                        if (confirmed) {
                            $data.texts.del(data.id).then(function (result) {
                                deferred.resolve();
                            }, function (ex) {
                                deferred.reject(ex);
                            });
                        }
                    });

                    return deferred.promise;
                }

            };


            $scope.back = function () {
                $location.previous('/content');
            };
            
            $scope.create = function () {
                $location.next('/content/texts/new');
            };

            $scope.gridFn = {

                edit: function (text) {
                    $location.next('/content/texts/' + text.id);
                },

                delete: function (text) {
                    fn.delete(text).then(function () {
                        $scope.data.items = _.filter($scope.data.items, function (x) { return x.id !== text.id; });
                    }, function (ex) {
                        logger.error(ex);
                    });
                }

            };


            fn.load().then(function (response) {
                $scope.data = response;
            }, function (ex) {
                logger.error(ex);
            });

        });
})();