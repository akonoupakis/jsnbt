/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('pnlLogin', ['$rootScope', '$q', 'AuthService', 'AUTH_EVENTS', 'CONTROL_EVENTS', function ($rootScope, $q, AuthService, AUTH_EVENTS, CONTROL_EVENTS) {

            var LoginPanel = function (scope, element, attrs) {
                element.addClass('pnl-login');

                this.controls = [];

                var self = this;

                scope.valid = false;
                scope.failed = false;

                scope.username = '';
                scope.password = '';

                scope.$on(CONTROL_EVENTS.register, function (sender, control) {
                    self.controls.push(control);
                });

                scope.login = function () {
                    scope.failed = false;
                    scope.valid = true;

                    _.each(self.controls, function (c) {
                        if (typeof (c.initValidation) === 'function')
                            c.initValidation();
                    });

                    $q.all(_.map(_.filter(self.controls, function (f) { return typeof (f.isValid) === 'function'; }), function (x) { return x.isValid(); })).then(function (result) {

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
            };

            return {
                restrict: 'E',
                replace: true,
                scope: {
                },
                link: function (scope, element, attrs) {
                    return new LoginPanel(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/panels/pnlLogin.html'
            };

        }]);

})();