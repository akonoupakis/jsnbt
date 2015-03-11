/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlRegistration', function ($rootScope, $data, AuthService, AUTH_EVENTS, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngRoles: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-registration');
                                        
                    scope.valid = false;
                    scope.validEmail = false;

                    scope.username = '';
                    scope.password = '';
                    scope.firstName = '';
                    scope.lastName = '';

                    scope.$watch('username', function (value) {
                        if (value) {
                            if (!scope.username.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i)) {
                                scope.valid = false;
                                scope.validEmail = false;
                            }
                            else {
                                scope.validEmail = true;
                            }
                        }
                    });

                    scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
                        sender.stopPropagation();

                        if (!value)
                            scope.valid = false;
                    });

                    scope.register = function () {
                        scope.valid = true;
                        scope.validEmail = true;
                        scope.$broadcast(CONTROL_EVENTS.initiateValidation);
                        if (scope.valid) {
                            if (!scope.username.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i)) {
                                scope.valid = false;
                                scope.validEmail = false;
                            }
                            else {
                                $data.users.post($data.create('users', {
                                    username: scope.username,
                                    password: scope.password,
                                    firstName: scope.firstName,
                                    lastName: scope.lastName,
                                    roles: scope.ngRoles
                                })).then(function (created) {
                                    $rootScope.$broadcast(AUTH_EVENTS.userCreated, created);

                                    AuthService.login(scope.username, scope.password).then(function (user) {
                                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                                    }, function (error) {
                                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                                    });
                                }, function (error) {
                                    throw error;
                                });
                            }
                        }
                    };
                },
                templateUrl: 'tmpl/core/controls/ctrlRegistration.html'
            };

        });

})();