/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TestController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, TreeNodeService, $data, AuthService) {
          
            $scope.logout = function () {
                AuthService.logout();
            };

            var userId = 1;
            $scope.click = function () {
                
                //$data.tests.post({ key: 'a', value: {}}).then(function (results) {
                //    console.log('result', results);
                //}, function (error) {
                //    console.log('error', error);
                //});

                $data.users.post({
                    username: 'test@test.com' + userId,
                    password: 'asdasd',
                    firstName: 'Alpha',
                    lastName: 'Vita',
                    roles: []
                }).then(function (results) {
                    console.log('result', results);
                    userId++;
                }, function (error) {
                    console.log('error', error);
                });

            };
          
        });
})();