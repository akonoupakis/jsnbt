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
                    ngRows: '=',
                    ngValidate: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-text-area');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.initiated = false;

                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.ngEnabled === undefined || scope.ngEnabled === true) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }

                            if (valid) {
                                if (scope.ngValidate) {
                                    valid = scope.ngValidate();
                                }
                            }
                        }

                        if (!valid)
                            element.addClass('invalid');
                        else
                            element.removeClass('invalid');

                        return valid;
                    };

                    scope.$on(FORM_EVENTS.initiateValidation, function (sender) {
                        scope.initiated = true;
                        scope.$emit(FORM_EVENTS.valueIsValid, isValid());
                    });

                    scope.isValid = function () {
                        return isValid();
                    };

                },
                templateUrl: 'tmpl/partial/controls/ctrlTextArea.html' 
            };

        });

})();