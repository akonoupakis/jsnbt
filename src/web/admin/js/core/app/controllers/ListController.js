/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ListController', ['$scope', '$rootScope', '$routeParams', '$location', '$logger', '$q', '$data', '$jsnbt', 'PagedDataService', 'ModalService', 'LocationService', function ($scope, $rootScope, $routeParams, $location, $logger, $q, $data, $jsnbt, PagedDataService, ModalService, LocationService) {
           
            var logger = $logger.create('ListController');

            $scope.name = undefined;
            $scope.domain = $routeParams.domain;
            $scope.data = {};
            
            $scope.list = _.first(_.filter($jsnbt.lists, function (x) { return x.domain === $routeParams.domain && x.id === $routeParams.list; }));
            $scope.name = $scope.list.name;


            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    PagedDataService.get(dpd.data.get, {
                        domain: $routeParams.domain,
                        list: $routeParams.list
                    }).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                setLocation: function () { 
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();
                    var breadcrumbLast = _.last(breadcrumb);
                    breadcrumb = breadcrumb.slice(0, breadcrumb.length - 2);
                    breadcrumb.push(breadcrumbLast);
                    $scope.current.setBreadcrumb(breadcrumb);

                    deferred.resolve(breadcrumb);

                    return deferred.promise;
                },

                delete: function (data) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'are you sure you want to delete the item ' + data.name + '?',
                        controller: 'DeletePromptController',
                        template: 'tmpl/core/modals/deletePrompt.html'
                    }).then(function (confirmed) {
                        if (confirmed) {
                            $data.data.del(data.id).then(function (result) {
                                deferred.resolve();
                            }, function (ex) {
                                deferred.reject(ex);
                            });
                        }
                        else {
                            deferred.reject();
                        }
                    });

                    return deferred.promise;
                }

            };
                       

            $scope.back = function () {
                if ($rootScope.location.previous) {
                    $location.previous($rootScope.location.previous);
                }
                else {
                    if ($scope.current.breadcrumb[0].name === 'modules') {
                        $location.previous('/modules/' + $routeParams.domain);
                    }
                    else {
                        $location.previous('/content/data');
                    }
                }
            };
                       
            $scope.create = function () {

                if ($scope.current.breadcrumb[0].name === 'modules') {
                    $location.next('/modules/' + $routeParams.domain + '/list/' + $routeParams.list + '/new');
                }
                else {
                    $location.next('/content/data/' + $routeParams.domain + '/' + $routeParams.list + '/new');
                }
            };

            $scope.gridFn = {

                edit: function (item) {
                    if ($scope.current.breadcrumb[0].name === 'modules') {
                        $location.next('/modules/' + $routeParams.domain + '/list/' + $routeParams.list + '/' + item.id);
                    }
                    else {
                        $location.next('/content/data/' + $routeParams.domain + '/' + $routeParams.list + '/' + item.id);
                    }
                },

                delete: function (item) {
                    fn.delete(item).then(function (response) {
                        $scope.data.items = _.filter($scope.data.items, function (x) { return x.id !== item.id; });
                    }, function (ex) {
                        logger.error(ex);
                    });
                }

            };


            fn.setLocation().then(function () {
                fn.load().then(function (data) {
                    $scope.data = data;
                }, function (loadEx) {
                    logger.error(loadEx);
                });
            }, function (ex) {
                logger.error(ex);
            });

        }]);
})();