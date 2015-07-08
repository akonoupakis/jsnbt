/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlSelect', ['$timeout', 'CONTROL_EVENTS', function ($timeout, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngOptions: '=',
                    ngDefault: '=',
                    ngValueField: '@',
                    ngNameField: '@',
                    ngValidate: '=',
                    ngValid: '=',
                    ngAutoFocus: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-select');

                    scope.valueField = scope.ngValueField ? scope.ngValueField : 'value';
                    scope.nameField = scope.ngNameField ? scope.ngNameField : 'name';
                    
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

                    var isValid = function () {
                        var valid = true;

                        if (!scope.ngDisabled) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }

                            scope.notFound = false;
                            if (valid && scope.ngModel !== undefined) {
                                var option = _.first(_.filter(scope.ngOptions, function (x) { return x[scope.valueField] === scope.ngModel; }));
                                if (!option) {
                                    valid = false;
                                    scope.notFound = true;
                                }
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
                            element.find('select').focus();
                        }, 200);
                    }

                },
                templateUrl: 'tmpl/core/controls/ctrlSelect.html'
            };

        }]);

})();