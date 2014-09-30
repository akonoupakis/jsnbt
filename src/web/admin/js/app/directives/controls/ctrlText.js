/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlText', function ($timeout, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngValidate: '=',
                    ngInvalid: '=',
                    ngCharacters: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-text');
                    
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

                    scope.$watch('ngInvalid', function (newValue) {
                        if (initiated)
                            if (newValue === false)
                                scope.valid = false;
                    });
                    
                    var isValid = function () {
                        var valid = true;

                        if (scope.enabled) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }

                            if (valid) {
                                if (scope.ngValidate) {
                                    valid = scope.ngValidate(scope.ngModel);
                                }
                            }
                        }

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

                },
                templateUrl: 'tmpl/partial/controls/ctrlText.html' 
            };

        })
        .directive('ctrlTextAllowed', function () {

            return {
                restrict: "A",
                link: function ($scope, $element, $attrs) {
                    var chars = ($scope.ngCharacters || '').split('');
                    if (chars.length > 0) {
                        $element.on("keypress", function (event) {
                            var char = String.fromCharCode(event.which);
                            if (chars.indexOf(char) === -1)
                                event.preventDefault();
                        });
                    }
                }
            };

        });

})();