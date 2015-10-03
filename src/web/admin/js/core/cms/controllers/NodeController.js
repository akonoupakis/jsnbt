/* global angular:false */

(function () {
    "use strict";

    var NodeController = function ($scope, $rootScope, $logger, $q) {
        jsnbt.controllers.NodeFormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('NodeController');
        
        var getBreadcrumbFn = $scope.getBreadcrumb;
        $scope.getBreadcrumb = function () {
            var deferred = $q.defer();

            getBreadcrumbFn().then(function (breadcrumb) {

                $scope.getNodeBreadcrumb($scope.isNew() ? { id: 'new', parent: $scope.parent ? $scope.parent.id : '' } : $scope.node, $scope.prefix).then(function (bc) {

                    breadcrumb.splice($scope.offset);

                    _.each(bc, function (c) {
                        breadcrumb.push(c);
                    });

                    deferred.resolve(breadcrumb);

                }, function (ex) {
                    deferred.reject(ex);
                });

            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    NodeController.prototype = Object.create(jsnbt.controllers.NodeFormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('NodeController', ['$scope', '$rootScope', '$logger', '$q', NodeController]);
})();