/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlTextArea', function ($timeout, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngRows: '=',
                    ngValidate: '=',
                    ngValid: '=',
                    ngAutoFocus: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-text-area');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                    scope.$watch('ngEnabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;
                    });

                    var initiated = false;

                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    scope.$watch('ngValid', function (newValue) {
                        if (initiated)
                            if (newValue === false)
                                scope.valid = false;
                            else
                                scope.valid = isValid();
                    });

                    var isValid = function () {
                        var valid = true;

                        if (scope.enabled) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }

                            if (valid) {
                                if (scope.ngValidate) {
                                    valid = scope.ngValidate();
                                }
                            }
                        }

                        if (valid && scope.ngValid === false)
                            valid = false;
                        
                        return valid;
                    };

                    scope.$watch('ngModel', function () {
                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$on(FORM_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(FORM_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('textarea').focus();
                        }, 200);
                    }
                },
                templateUrl: 'tmpl/core/controls/ctrlTextArea.html'
            };

        });

})();