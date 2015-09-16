/* global angular:false */



(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlDatePicker', ['$timeout', 'CONTROL_EVENTS', function ($timeout, CONTROL_EVENTS) {

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
                    ngTime: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-date-picker');
                    
                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    
                    scope.model = undefined;

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
                                valid = !!scope.model && scope.model !== '';
                            }

                            if (valid) {
                                if (scope.ngValidate) {
                                    valid = scope.ngValidate(scope.model);
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
                            element.find('.input-group .form-control').focus();
                        }, 200);
                    }
                    

                    $timeout(function () {
                        
                        if (scope.ngTime) {
                            $('.input-group > input', element).datetimepicker({
                                format: 'DD/MM/YYYY HH:mm',
                                ignoreReadonly: true,
                                useCurrent: false
                            });

                            $('.input-group > input', element).on("dp.change", function (e) {
                                if (e.date) {
                                    var time = e.date._d.getTime();
                                    if (scope.ngModel !== time) {
                                        scope.ngModel = time;
                                        scope.changed();
                                    }
                                }
                                else {
                                    scope.ngModel = undefined;
                                    scope.changed();
                                }
                            });

                            $('.input-group > input', element).data("DateTimePicker").date(new Date(scope.ngModel));
                        }
                        else {
                            $('.input-group > input', element).datepicker({
                                autoclose: true,
                                format: 'dd/mm/yyyy'
                            }).on('changeDate', function (e) {
                                if (e.date) {
                                    var time = e.date.getTime();
                                    if (scope.ngModel !== time) {
                                        scope.ngModel = time;
                                        scope.changed();
                                    }
                                }
                                else {
                                    scope.ngModel = undefined;
                                    scope.changed();
                                }
                            });;
                        }
                    });

                    scope.select = function () {
                        if (scope.ngTime) {
                            $('.input-group > input', element).data("DateTimePicker").show();
                        }
                        else {
                            $('.input-group > input', element).datepicker('show');
                        }
                    };

                    scope.clear = function () {
                        if (scope.ngTime) {
                            $('.input-group > input', element).data("DateTimePicker").clear();
                        }
                        else {
                            $('.input-group > input', element).datepicker('clearDates');
                        }
                    };

                    scope.$watch('ngModel', function (val) {
                        if (val) {
                            var date = new Date(val);
                            if (date) {
                                if (scope.ngTime) {
                                    scope.model = moment(date).format('DD/MM/YYYY HH:mm');
                                }
                                else {
                                    scope.model = moment(date).format('DD/MM/YYYY');
                                }
                            }
                            else {
                                scope.model = undefined;
                            }
                        } else {
                            scope.model = undefined;
                        }
                    });

                },
                templateUrl: 'tmpl/core/controls/ctrlDatePicker.html'
            };

        }]);

})();