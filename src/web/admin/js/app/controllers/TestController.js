/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TestController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, TreeNodeService, $data, AuthService) {
          
            $scope.logout = function () {
                AuthService.logout();
            };

            $scope.click = function () {
                
                $data.tests.get('9846f2e6232cf822').then(function (results) {
                    console.log('result', results);
                }, function (error) {
                    console.log('error', error);
                });

            };
          
        });
})();