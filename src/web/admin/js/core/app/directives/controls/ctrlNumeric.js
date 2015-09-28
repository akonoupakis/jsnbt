﻿/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlNumeric', ['$timeout', 'CONTROL_EVENTS', function ($timeout, CONTROL_EVENTS) {

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
                    ngMin: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-numeric');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    
                    var initiated = false;

                    scope.changed = function () {
                        $timeout(function () {
                           scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    scope.$watch('ngValid', function (newValue) {
                        if (initiated)
                            if (newValue === false)
                                scope.valid = false;
                            else
                                scope.valid = isValid();
                    });
                    
                    scope.$watch('ngValidating', function (newValue) {
                        if (initiated)
                            if (newValue === false)
                                scope.valid = true;
                            else
                                scope.valid = isValid();
                    });

                    var isValid = function () {
                        var valid = true;

                        var validating = scope.ngValidating !== false;
                        if (validating && !scope.ngDisabled) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }

                            if (valid) {
                                if (scope.ngValidate) {
                                    valid = scope.ngValidate(scope.ngModel);
                                }
                            }

                            if (valid && scope.ngValid === false)
                                valid = false;
                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function () {
                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });

                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('input[type="number"]').focus();
                        }, 200);
                    }

                },
                templateUrl: 'tmpl/core/controls/ctrlNumeric.html'
            };

        }]);

})();