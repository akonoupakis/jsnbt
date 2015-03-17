/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TestListController', function ($scope, $timeout, $location, $logger, $controller, $q, $data, PagedDataService, ModalService, LocationService) {
           
            var logger = $logger.create('TestListController');

            $controller('ListBaseController', {
                $scope: $scope
            });
         
            $scope.back = function () {
                $location.previous('/content');
            };
            
            $scope.create = function () {
                $location.next('/content/texts/new');
            };

            $scope.gridFn = {

                edit: function (text) {
                    $location.next('/content/test/' + text.id);
                },

                delete: function (text) {
                    ModalService.open({
                        title: 'are you sure you want to delete the key ' + data.key + '?',
                        controller: 'DeletePromptController',
                        template: 'tmpl/core/modals/deletePrompt.html'
                    }).then(function (confirmed) {
                        if (confirmed) {
                            $data.texts.del(data.id).then(function (result) {
                                $scope.remove(text.id);
                            }, function (ex) {
                                throw ex;
                            });
                        }
                    });
                }

            };

            PagedDataService.get(dpd.texts.get, {}).then(function (response) {
                $scope.set(response);
            }, function (error) {
                logger.error(error);
            });

        });
})();