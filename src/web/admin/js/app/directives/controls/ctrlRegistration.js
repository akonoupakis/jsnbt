/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlRegistration', function ($rootScope, $data, AuthService, AUTH_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-registration');
                                        
                    scope.register = function () {
                        var $usernameElement = $('input[type="text"][name="username"]', element);
                        var $passwordElement = $('input[type="password"][name="password"]', element);
                        var $firstNameElement = $('input[type="text"][name="firstName"]', element);
                        var $lastNameElement = $('input[type="text"][name="lastName"]', element);

                        var username = $usernameElement.val();
                        var password = $passwordElement.val();
                        var firstName = $firstNameElement.val();
                        var lastName = $lastNameElement.val();

                        if (username !== '' && password !== '') {
                            $data.users.post($data.create('users', {
                                username: username,
                                password: password,
                                firstName: firstName,
                                lastName: lastName
                            })).then(function () {
                                AuthService.login(username, password).then(function (user) {
                                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                                }, function (error) {
                                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                                });
                            }, function (error) {
                                throw error;
                            });
                        }
                    };
                },
                templateUrl: 'tmpl/partial/controls/ctrlRegistration.html'
            };

        });

})();