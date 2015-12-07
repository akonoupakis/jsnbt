/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('pnlLogin', ['$rootScope', '$q', 'AuthService', 'AUTH_EVENTS', 'CONTROL_EVENTS', function ($rootScope, $q, AuthService, AUTH_EVENTS, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                },
                link: function (scope, element, attrs) {
                    element.addClass('pnl-login');
                    
                    scope.valid = false;
                    scope.failed = false;

                    scope.username = '';
                    scope.password = '';
                                        
                    scope.login = function () {
                        scope.failed = false;
                        scope.valid = true;

                        _.each($rootScope.controller.controls, function (c) {
                            if (typeof (c.initValidation) === 'function')
                                c.initValidation();
                        })

                        $q.all(_.map(_.filter($rootScope.controller.controls, function (f) { return typeof (f.isValid) === 'function'; }), function (x) { return x.isValid(); })).then(function (result) {

                            scope.valid = _.all(result, function (x) { return x === true; });

                            if (scope.valid) {
                                AuthService.login(scope.username, scope.password).then(function (user) {
                                    if (AuthService.isInRole(user, 'admin'))
                                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                                    else
                                        scope.failed = true;
                                }).catch(function (error) {
                                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                                    scope.failed = true;
                                });
                            }

                        });
                    };
                },
                templateUrl: 'tmpl/core/panels/pnlLogin.html'
            };

        }]);

})();