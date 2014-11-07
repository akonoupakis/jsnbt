/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCheckList', function ($timeout, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngOptions: '=',
                    ngNameField: '@',
                    ngValueField: '@',
                    ngDisabledField: '@',
                    ngDescriptionField: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-check-list');
                    
                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                    scope.valueField = scope.ngValueField ? scope.ngValueField : 'value';
                    scope.nameField = scope.ngNameField ? scope.ngNameField : 'name';
                    scope.disabledField = scope.ngDisabledField ? scope.ngDisabledField : 'disabled';
                    scope.descriptionField = scope.ngDescriptionField ? scope.ngDescriptionField : 'description';

                    var initiating = true;
                    var initiated = false;
                    
                    scope.$watch('ngOptions', function (newValue, prevValue) {
                        if (newValue) {
                            $timeout(function () {
                                $(newValue).each(function (o, option) {
                                    var chkField = element.find('#chk' + scope.id + option[scope.valueField]);
                                    chkField.bootstrapSwitch({
                                        disabled: !scope.enabled || (option[scope.disabledField] || false),
                                        state: (scope.ngModel || []).indexOf(option[scope.valueField]) !== -1
                                    });

                                    chkField.on('switchChange.bootstrapSwitch', function (event, state) {
                                        if (!initiating && initiated) {
                                            if (state === true) {
                                                if (scope.ngModel.indexOf(option[scope.valueField]) === -1)
                                                    scope.ngModel.push(option[scope.valueField]);
                                            }
                                            else {
                                                scope.ngModel = _.filter(scope.ngModel, function (x) { return x !== option[scope.valueField]; });
                                            }

                                            scope.$apply();
                                            scope.valid = isValid();

                                            $timeout(function () {
                                                scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
                                            }, 50);
                                        }
                                    });
                                });
                            }, 200);
                        }
                    });

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        initiated = false;

                        if (newValue) {
                            $(scope.ngOptions).each(function (o, option) {
                                var chkFieldWrapper = $('.bootstrap-switch-id-chk' + scope.id + option[scope.valueField]);
                                if (chkFieldWrapper.length > 0) {
                                    var chkField = element.find('#chk' + scope.id + option[scope.valueField]);

                                    var wasDisabled = chkFieldWrapper.hasClass('bootstrap-switch-disabled');

                                    if (wasDisabled)
                                        chkField.bootstrapSwitch('disabled', false);

                                    var selected = newValue.indexOf(option[scope.valueField]) !== -1;
                                    chkField.bootstrapSwitch('state', selected);

                                    if(wasDisabled)
                                        chkField.bootstrapSwitch('disabled', true);
                                }
                            });

                            scope.valid = isValid();
                        }

                        initiated = true;
                    });

                    scope.$watch('ngEnabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;

                        $(scope.ngOptions).each(function (o, option) {
                            if ($('.bootstrap-switch-id-chk' + scope.id + option[scope.valueField], element).length > 0) {
                                var chkField = element.find('#chk' + scope.id + option[scope.valueField]);

                                if (!scope.enabled) {
                                    chkField.bootstrapSwitch('disabled', true);
                                }
                                else {
                                    chkField.bootstrapSwitch('disabled', option[scope.disabledField] || false);
                                }
                            }
                        });

                        scope.valid = isValid();
                    });

                    var isValid = function () {
                        var valid = true;

                        if (scope.enabled) {
                            if (scope.ngRequired) {
                                valid = (scope.ngModel || []).length > 0;
                            }
                        }

                        return valid;
                    };

                    scope.$on(FORM_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(FORM_EVENTS.valueIsValid, scope.valid);
                    });

                    if (scope.ngModel)
                        initiated = true;

                    setTimeout(function () {
                        initiating = false;
                    }, 300);
                },
                templateUrl: 'tmpl/core/controls/ctrlCheckList.html'
            };

        });

})();