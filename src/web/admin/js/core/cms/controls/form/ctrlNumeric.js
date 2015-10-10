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

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {


                        if (self.scope.ngRequired) {
                            valid = !!self.scope.ngModel && self.scope.ngModel !== '';
                        }
                    }

                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngValidating: '=',
                    ngValidate: '=',
                    ngValid: '=',
                    ngAutoFocus: '=',
                    ngMax: '=',
                    ngMin: '=',
                    ngChangeFn: '='
                },
                link: function (scope, element, attrs) {
                    return new NumericControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlNumeric.html'
            };

        }]);

})();