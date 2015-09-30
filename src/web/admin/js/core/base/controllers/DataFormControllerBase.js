/* global angular:false */

(function () {
    "use strict";

    jsnbt.DataFormControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.FormControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('DataFormControllerBase');
 
        $scope.list = undefined;
        $scope.item = undefined;

        $scope.enqueue('preloading', function () {
            var deferred = $q.defer();

            $scope.list = _.find($jsnbt.lists, function (x) { return x.domain === $scope.domain && x.id === ($scope.listId || $routeParams.list); });

            $scope.setTitle($scope.list.name);

            $scope.localized = $scope.application.localization.enabled && ($scope.list.localized === undefined || $scope.list.localized === true);

            $scope.tmpl = $scope.list.form;

            deferred.resolve();

            return deferred.promise;
        });

        $scope.load = function () {
            var deferred = $q.defer();

            if ($scope.isNew()) {
                deferred.resolve();
            }
            else {
                $data.data.get($scope.id).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        };

        $scope.get = function () {
            return $scope.item;
        };

        $scope.set = function (data) {
            var deferred = $q.defer();
            
            if ($scope.isNew()) {
                $scope.setTitle('');

                $scope.item = $data.create('data', {
                    domain: $scope.domain,
                    list: $scope.list.id
                })

                $scope.setValid(true);
                $scope.setPublished(false);

                deferred.resolve($scope.item);
            }
            else {
                if (data) {
                    $scope.setTitle(data.title[$scope.defaults.language]);
                    $scope.item = data;

                    $scope.setValid(true);
                    $scope.setPublished(true);

                    deferred.resolve($scope.item);
                }
                else {
                    deferred.reject(new Error('data is not defined for setting into scope'));
                }
            }
            
            return deferred.promise;
        };
                
        var getBreadcrumbFn = $scope.getBreadcrumb;
        $scope.getBreadcrumb = function () {
            var deferred = $q.defer();

            getBreadcrumbFn().then(function (breadcrumb) {
                breadcrumb[breadcrumb.length - 2].name = $scope.list.name;
                deferred.resolve(breadcrumb);
            }).catch(function (ex) {
                deferred.reject(ex);
            });

            return deferred.promise;
        };

        $scope.push = function (data) {
            var deferred = $q.defer();

            if ($scope.isNew()) {
                $data.data.post($scope.item).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }
            else {
                $data.data.put($scope.id, $scope.item).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        };

    };
    jsnbt.DataFormControllerBase.prototype = Object.create(jsnbt.FormControllerBase.prototype);

})();