/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('pnlRegistration', ['$rootScope', '$q', '$data', 'AuthService', 'AUTH_EVENTS', 'CONTROL_EVENTS', function ($rootScope, $q, $data, AuthService, AUTH_EVENTS, CONTROL_EVENTS) {

            var RegistrationPanel = function (scope, element, attrs) {
                element.addClass('pnl-registration');

                this.controls = [];

                var self = this;

                scope.valid = false;
                scope.validEmail = false;

                scope.username = '';
                scope.password = '';
                scope.firstName = '';
                scope.lastName = '';

                scope.$on(CONTROL_EVENTS.register, function (sender, control) {
                    self.controls.push(control);
                });

                scope.validateEmail = function (value) {
                    return value.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i);
                }
                
                scope.register = function () {
                    scope.valid = true;
      
                    _.each(self.controls, function (c) {
                        if (typeof (c.initValidation) === 'function')
                            c.initValidation();
                    });

                    $q.all(_.map(_.filter(self.controls, function (f) { return typeof (f.isValid) === 'function'; }), function (x) { return x.isValid(); })).then(function (result) {

                        scope.valid = _.all(result, function (x) { return x === true; });

                        if (scope.valid) {
                            AuthService.register($data.create('users', {
                                username: scope.username,
                                password: scope.password,
                                firstName: scope.firstName,
                                lastName: scope.lastName,
                                roles: scope.ngRoles
                            })).then(function (created) {
                                $rootScope.$broadcast(AUTH_EVENTS.userCreated, created);

                                AuthService.login(scope.username, scope.password).then(function (user) {
                                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                                }).catch(function (error) {
                                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                                });
                            }).catch(function (error) {
                                throw error;
                            });
                        }

                    });
                };
            };

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngRoles: '='
                },
                link: function (scope, element, attrs) {
                    return new RegistrationPanel(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/panels/pnlRegistration.html'
            };

        }]);

})();