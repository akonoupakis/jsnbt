/* global angular:false */



(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlDatePicker', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var DatePickerControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-date-picker');

                scope.model = undefined;
                
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
                            format: 'dd/mm/yyyy',
                            orientation: 'top'
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

                this.init().then(function () {
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('.input-group .form-control').focus();
                        }, 200);
                    }
                });
            };
            DatePickerControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            DatePickerControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            valid = !!self.scope.model && self.scope.model !== '';
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
                    ngAutoFocus: '=',
                    ngTime: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new DatePickerControl(scope, element, attrs);
                    $rootScope.controller.register(control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlDatePicker.html'
            };

        }]);

})();