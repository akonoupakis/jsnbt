/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LoginController', function ($scope, $location, $timeout, $logger, $q, $data, AUTH_EVENTS) {
           
            var logger = $logger.create('LoginController');
                             
            $scope.$on(AUTH_EVENTS.loginSuccess, function (sender, user) {
                document.location = '/admin';
            });

        });
})();