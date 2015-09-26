/* global angular:false */

(function () {
    "use strict";
    
    jsnbt.DataListControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.ListControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('DataListControllerBase');

        $scope.name = $route.current.$$route.list;
        $scope.list = _.find($jsnbt.lists, function (x) { return x.domain === $scope.domain && x.id === $scope.name; });
        $scope.title = $scope.list.name
        
        $scope.create = function () {
            $location.next(_.last($scope.current.breadcrumb).url + '/new');
        };

        $scope.gridFn.canEdit = function (row) {
            return true;
        };

        $scope.gridFn.edit = function (row) {
            $location.next(_.last($scope.current.breadcrumb).url + '/' + row.id);
        };

        $scope.gridFn.canDelete = function (row) {
            return true;
        };

        $scope.gridFn.delete = function (row) {
            ModalService.open({
                title: 'are you sure you want to permanently delete ' + row.title[$scope.defaults.language] + '?',
                controller: 'DeletePromptController',
                template: 'tmpl/core/modals/deletePrompt.html'
            }).then(function (result) {
                if (result) {
                    $data.data.del(row.id).then(function () {
                        $scope.remove(row);
                    }, function (error) {
                        deferred.reject(error);
                    });
                }
            });
        };

        $scope.load = function () {
            var deferred = $q.defer();
            
            PagedDataService.get(jsnbt.db.data.get, {
                domain: $scope.domain,
                list: $scope.list.id
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

    };
    jsnbt.DataListControllerBase.prototype = Object.create(jsnbt.ListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DataListControllerBase', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', jsnbt.DataListControllerBase]);
})();