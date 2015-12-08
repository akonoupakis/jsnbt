/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlSelect', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var SelectControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-select');

                scope.faults.invalid = false;

                scope.valueField = scope.ngValueField ? scope.ngValueField : 'value';
                scope.nameField = scope.ngNameField ? scope.ngNameField : 'name';
                
                this.init().then(function () {
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('select').focus();
                        }, 200);
                    }
                });
            };
            SelectControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            SelectControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                self.scope.faults.invalid = false;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            self.scope.valid = !!self.scope.ngModel && self.scope.ngModel !== '';
                        }

                        if (self.scope.valid && self.scope.ngModel !== undefined && self.scope.ngModel !== '') {
                            var option = _.find(self.scope.ngOptions, function (x) { return x[self.scope.valueField] === self.scope.ngModel; });
                            if (!option) {
                                self.scope.valid = false;
                                self.scope.faults.invalid = true;
                            }
                        }

                    }

                    deferred.resolve(self.scope.valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngOptions: '=',
                    ngDefault: '=',
                    ngValueField: '@',
                    ngNameField: '@',
                    ngAutoFocus: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new SelectControl(scope, element, attrs);
                    $rootScope.controller.register(control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlSelect.html'
            };

        }]);

})();