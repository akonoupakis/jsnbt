/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('UsersController', function ($scope, $location, $logger, $q, $data, PagedDataService, ModalService, LocationService) {
            
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

                    //ModalService.open({
                    //    title: 'Type a text key',
                    //    controller: 'NamePromptController',
                    //    template: 'tmpl/partial/modal/namePrompt.html'
                    //}).then(function (result) {
                    //    if (!!result && result !== '') {
                    //        $data.texts.get({ key: result }).then(function (getResponse) {
                    //            var first = _.first(getResponse);
                    //            if (first) {
                    //                deferred.resolve(first);
                    //            }
                    //            else {
                    //                $data.texts.post($data.create('texts', { key: result })).then(function (response) {
                    //                    deferred.resolve(response);
                    //                }, function (error) {
                    //                    deferred.reject(error);
                    //                });
                    //            }
                    //        }, function (getError) {
                    //            deferred.reject(getError);
                    //        });
                    //    }
                    //});

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

        });
})(); 