/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlPassword', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var PasswordControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-password');
               
                this.init().then(function () {
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('input[type="password"]').focus();
                        }, 200);
                    }
                });
            };
            PasswordControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            PasswordControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            valid = !!self.scope.ngModel && self.scope.ngModel !== '';
                        }

                    }

                    self.scope.valid = valid;
                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngAutoFocus: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new PasswordControl(scope, element, attrs);
                    $rootScope.controller.register(control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlPassword.html'
            };

        }]);

})();