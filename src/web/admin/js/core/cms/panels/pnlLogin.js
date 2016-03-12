/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('pnlLogin', ['$rootScope', '$q', 'AuthService', 'AUTH_EVENTS', 'CONTROL_EVENTS', function ($rootScope, $q, AuthService, AUTH_EVENTS, CONTROL_EVENTS) {

            var LoginPanel = function (scope, element, attrs) {
                element.addClass('pnl-login');

                scope.step = 'login';

                scope.data = {
                    login: {
                        username: '',
                        password: ''
                    },
                    forgot: {
                        username: ''
                    },
                    reset: {
                        username: '',
                        code: '',
                        password: '',
                        passwordConfirmation: ''
                    }
                };
                
                scope.forgotPassword = function () {
                    scope.step = 'forgot';
                };

                scope.resetPassword = function () {
                    scope.step = 'reset';
                };

                scope.passwordChanged = function () {
                    scope.step = 'changed';
                };

                scope.backToLogin = function () {
                    scope.data.login.username = '';
                    scope.data.login.password = '';
                    scope.step = 'login';
                };

                scope.$watch('data.login.username', function (newValue) {
                    scope.data.forgot.username = newValue;
                });

                scope.$watch('data.forgot.username', function (newValue) {
                    scope.data.reset.username = newValue;
                });
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

        }])
        .controller('PanelLoginController', ['$scope', '$rootScope', '$q', 'AuthService', 'AUTH_EVENTS', 'CONTROL_EVENTS', function ($scope, $rootScope, $q, AuthService ,AUTH_EVENTS, CONTROL_EVENTS) {
            var self = this;

            this.controls = [];

            $scope.valid = false;
            $scope.failed = false;

            $scope.$on(CONTROL_EVENTS.register, function (sender, control) {
                self.controls.push(control);
            });

            $scope.submitting = false;
            $scope.submit = function () {
                $scope.failed = false;
                $scope.valid = true;
                $scope.submitting = true;

                _.each(self.controls, function (c) {
                    if (typeof (c.initValidation) === 'function')
                        c.initValidation();
                });

                $q.all(_.map(_.filter(self.controls, function (f) { return typeof (f.isValid) === 'function'; }), function (x) { return x.isValid(); })).then(function (result) {

                    $scope.valid = _.all(result, function (x) { return x === true; });

                    if ($scope.valid) {
                        AuthService.login($scope.data.login.username, $scope.data.login.password).then(function (user) {
                            if (AuthService.isInRole(user, 'admin')) {
                                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                            }
                            else {
                                $scope.failed = true;
                                $scope.submitting = false;
                            }
                        }).catch(function (error) {
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                            $scope.failed = true;
                            $scope.submitting = false;
                        });
                    }

                });
            };
        }])
        .controller('PanelLoginForgotPasswordController', ['$scope', '$rootScope', '$q', 'AuthService', 'AUTH_EVENTS', 'CONTROL_EVENTS', function ($scope, $rootScope, $q, AuthService, AUTH_EVENTS, CONTROL_EVENTS) {
            var self = this;

            this.controls = [];

            $scope.valid = false;
            $scope.failed = false;
            
            $scope.$on(CONTROL_EVENTS.register, function (sender, control) {
                self.controls.push(control);
            });

            $scope.submitting = false;
            $scope.submit = function () {
                $scope.failed = false;
                $scope.valid = true;
                $scope.submitting = true;

                _.each(self.controls, function (c) {
                    if (typeof (c.initValidation) === 'function')
                        c.initValidation();
                });

                $q.all(_.map(_.filter(self.controls, function (f) { return typeof (f.isValid) === 'function'; }), function (x) { return x.isValid(); })).then(function (result) {

                    $scope.valid = _.all(result, function (x) { return x === true; });

                    if ($scope.valid) {
                        AuthService.requestPasswordResetCode($scope.data.forgot.username).then(function (success) {
                            $scope.submitting = false;
                            if (success) {
                                $scope.resetPassword();
                            }
                            else {
                                $scope.failed = true;
                            }
                        }).catch(function (error) {
                            $scope.submitting = false;
                            $scope.failed = true;
                        });
                    }

                });
            };
        }])
        .controller('PanelLoginResetPasswordController', ['$scope', '$rootScope', '$q', 'AuthService', 'AUTH_EVENTS', 'CONTROL_EVENTS', function ($scope, $rootScope, $q, AuthService, AUTH_EVENTS, CONTROL_EVENTS) {
            var self = this;

            this.controls = [];

            $scope.valid = false;
            $scope.failed = false;

            $scope.invalidPasswordComparison = false;

            $scope.$on(CONTROL_EVENTS.register, function (sender, control) {
                self.controls.push(control);
            });

            $scope.validatePasswordConfirm = function (value) {
                var valid = value === $scope.data.reset.password;
                $scope.invalidPasswordComparison = !valid;
                return valid;
            };

            $scope.submitting = false;
            $scope.submit = function () {
                $scope.failed = false;
                $scope.valid = true;
                $scope.submitting = true;

                _.each(self.controls, function (c) {
                    if (typeof (c.initValidation) === 'function')
                        c.initValidation();
                });

                $q.all(_.map(_.filter(self.controls, function (f) { return typeof (f.isValid) === 'function'; }), function (x) { return x.isValid(); })).then(function (result) {

                    $scope.valid = _.all(result, function (x) { return x === true; });

                    if ($scope.valid) {
                        AuthService.submitPasswordResetCode($scope.data.reset.username, $scope.data.reset.code, $scope.data.reset.password).then(function (success) {
                            $scope.submitting = false;
                            if (success) {
                                $scope.passwordChanged();
                            }
                            else {
                                $scope.failed = true;
                            }
                        }).catch(function (error) {
                            $scope.submitting = false;
                            $scope.failed = true;
                        });
                    }

                });
            };
        }])
       .controller('PanelLoginChangedPasswordController', ['$scope', '$rootScope', '$q', 'AuthService', 'AUTH_EVENTS', 'CONTROL_EVENTS', function ($scope, $rootScope, $q, AuthService, AUTH_EVENTS, CONTROL_EVENTS) {
           $scope.failed = false;
           
           $scope.submit = function () {           
               AuthService.login($scope.data.login.username, $scope.data.reset.password).then(function (user) {
                   if (AuthService.isInRole(user, 'admin'))
                       $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                   else
                       $scope.failed = true;
               }).catch(function (error) {
                   $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                   $scope.failed = true;
               });
                  
           };
       }]);

})();