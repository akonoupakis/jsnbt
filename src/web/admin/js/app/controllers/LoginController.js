/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LoginController', function ($scope, $location, $timeout, $logger, $q, $data) {
           
            var logger = $logger.create('LoginController');
                             
            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.login = function (credentials) {
                console.log('login', credentials);
                //AuthService.login(credentials).then(function (user) {
                //    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                //    $scope.setCurrentUser(user);
                //}, function () {
                //    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                //});
            };

        });
})();