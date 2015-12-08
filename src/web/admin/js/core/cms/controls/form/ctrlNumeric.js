/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNumeric', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var NumericControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;
                
                element.addClass('ctrl');
                element.addClass('ctrl-numeric');
                
                self.input = element.find('input.form-control');

                scope.faults.exceeded = false;

                this.init().then(function () {
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('input[type="number"]').focus();
                        }, 200);
                    }
                });
            };
            NumericControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            NumericControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                self.scope.faults.exceeded = false;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            if (!self.scope.ngModel)
                                self.scope.valid = false;
                        }

                        var inputValue = parseInt(self.input.val());
                        if (!isNaN(inputValue)) {
                            if (_.isNumber(self.scope.ngMin) && inputValue < self.scope.ngMin ||
                                _.isNumber(self.scope.ngMax) && inputValue > self.scope.ngMax) {
                                self.scope.faults.exceeded = true;
                                self.scope.valid = false;
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
                    ngAutoFocus: '=',
                    ngMax: '=',
                    ngMin: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new NumericControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlNumeric.html'
            };

        }]);

})();