/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlLogin', function ($rootScope, AuthService, AUTH_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-login');
                                        
                    scope.login = function () {

                        var $usernameElement = $('input[type="text"][name="username"]', element);
                        var $passwordElement = $('input[type="password"][name="password"]', element);

                        var username = $usernameElement.val();
                        var password = $passwordElement.val();

                        AuthService.login(username, password).then(function (user) {
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                        }, function (error) {
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        });
                    };
                },
                templateUrl: 'tmpl/partial/controls/ctrlLogin.html'
            };

        });

})();