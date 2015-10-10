/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCheckList', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var CheckListControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-check-list');

                scope.enabled = !scope.ngDisabled;

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
                                        self.validate();

                                        $timeout(function () {
                                            if (scope.ngChangeFn) {
                                                if (typeof (scope.ngChangeFn) === 'function') {
                                                    scope.ngChangeFn(scope.ngModel);
                                                }
                                            }
                                            else {
                                                $timeout(function () {
                                                    scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                                                }, 50);
                                            }
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

                                if (wasDisabled)
                                    chkField.bootstrapSwitch('disabled', true);
                            }
                        });

                        self.validate();
                    }

                    initiated = true;
                });

                scope.$watch('ngDisabled', function (newValue) {
                    scope.enabled = !newValue;

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

                    self.validate();
                });

                self.init(300).then(function () {
                    if (scope.ngModel)
                        initiated = true;

                    initiating = false;
                });

            };
            CheckListControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            CheckListControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {
                        if (self.scope.ngRequired) {
                            valid = (self.scope.ngModel || []).length > 0;
                        }
                    }

                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngOptions: '=',
                    ngNameField: '@',
                    ngValueField: '@',
                    ngDisabledField: '@',
                    ngDescriptionField: '@'
                }),
                link: function (scope, element, attrs) {
                    return new CheckListControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlCheckList.html'
            };

        }]);

})();