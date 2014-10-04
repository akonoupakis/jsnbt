/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlRegistration', function ($rootScope, $data, AuthService, AUTH_EVENTS, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngRoles: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-registration');
                                        
                    scope.valid = false;

                    scope.username = '';
                    scope.password = '';
                    scope.firstName = '';
                    scope.lastName = '';

                    scope.$on(FORM_EVENTS.valueIsValid, function (sender, value) {
                        sender.stopPropagation();

                        if (!value)
                            scope.valid = false;
                    });

                    scope.register = function () {
                        scope.valid = true;
                        scope.$broadcast(FORM_EVENTS.initiateValidation);
                        if (scope.valid) {
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
                    };
                },
                templateUrl: 'tmpl/partial/controls/ctrlRegistration.html'
            };

        });

})();