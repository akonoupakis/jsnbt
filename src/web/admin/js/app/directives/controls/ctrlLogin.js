/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlLogin', function ($rootScope, AuthService, AUTH_EVENTS, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl-login');
                    
                    scope.valid = false;

                    scope.username = '';
                    scope.password = '';

                     scope.$on(FORM_EVENTS.valueIsValid, function (sender, value) {
                       sender.stopPropagation();

                        if (!value)
                            scope.valid = false;
                    });
                    
                    scope.login = function () {
                        scope.valid = true;
                        scope.$broadcast(FORM_EVENTS.initiateValidation);
                        if (scope.valid) {
                            AuthService.login(scope.username, scope.password).then(function (user) {
                                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                            }, function (error) {
                                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                            });
                        }
                    };
                },
                templateUrl: 'tmpl/partial/controls/ctrlLogin.html'
            };

        });

})();