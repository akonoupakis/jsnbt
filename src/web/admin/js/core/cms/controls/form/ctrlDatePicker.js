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
                
                scope.leftInput = function (e) {
                    $timeout(function () {
                        if ($(e.currentTarget).val() === '') {
                            scope.ngModel = undefined;
                            scope.changed();

                            self.validate();
                        }
                    }, 200);
                }

                $timeout(function () {
                    $('.input-group > input.dpicker', element).datepicker({
                        autoclose: true,
                        format: 'dd/mm/yyyy',
                        orientation: 'top'
                    }).on('changeDate', function (e) {
                        if (e.date) {
                            var storedDate = new Date(scope.ngModel);
                            storedDate.setDate(e.date.getDate());
                            storedDate.setMonth(e.date.getMonth());
                            storedDate.setFullYear(e.date.getFullYear());
                            var storedTime = storedDate.getTime();

                            if (scope.ngModel !== storedTime) {
                                scope.ngModel = storedTime;
                                scope.changed();

                                self.validate();
                            }
                        }
                        else {
                            scope.ngModel = undefined;
                            scope.changed();

                            self.validate();
                        }
                    });

                    if (scope.ngTime) {
                        $('.input-group > input.tpicker', element).timepicker({
                            defaultTime: false,
                            autoclose: true,
                            orientation: { x: 'auto', y: 'top' },
                            showMeridian: false
                        });

                        $('.input-group > input.tpicker', element).on("changeTime.timepicker", function (e) {
                            if (e.time) {
                                var storedDate = scope.ngModel && !isNaN(scope.ngModel) ? new Date(scope.ngModel) : new Date();
                                storedDate.setHours(e.time.hours);
                                storedDate.setMinutes(e.time.minutes);
                                var storedTime = storedDate.getTime();

                                if (scope.ngModel !== storedTime) {
                                    scope.ngModel = storedTime;
                                    scope.changed();

                                    self.validate();
                                }
                            }
                            else {
                                scope.ngModel = undefined;
                                scope.changed();

                                self.validate();
                            }
                        });
                    }
                });

                scope.select = function () {
                    $('.input-group > input.dpicker', element).datepicker('show');

                    if (scope.ngTime) {
                        $('.input-group > input.tpicker', element).timepicker('showWidget');
                    }                    
                };

                scope.clear = function () {
                    $('.input-group > input.dpicker', element).datepicker('clearDates');

                    if (scope.ngTime) {
                        $('.input-group > input.tpicker', element).timepicker('clearDates');
                    }
                };

                scope.$watch('ngModel', function (val) {
                    if (val) {
                        var date = new Date(val);
                        if (date) {
                            scope.modelD = moment(date).format('DD/MM/YYYY');
                            scope.modelT = moment(date).format('HH:mm');
                        }
                        else {
                            scope.modelD = undefined;
                            scope.modelT = undefined;
                        }
                    } else {
                        scope.modelD = undefined;
                        scope.modelT = undefined;
                    }
                });

                this.init().then(function () {
                    if (scope.ngAutoFocus === true) {
                        setTimeout(function () {
                            element.find('.input-group .dpicker').focus();
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
                            valid = !!self.scope.modelD && self.scope.modelD !== '';
                            if (valid && self.scope.ngTime) {
                                valid = !!self.scope.modelT && self.scope.modelT !== '';
                            }
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
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlDatePicker.html'
            };

        }]);

})();