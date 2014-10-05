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
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                    var initiated = false;
                    
                    scope.$watch('ngOptions', function (newValue, prevValue) {
                        if (newValue) {
                            $timeout(function () {
                                $(newValue).each(function (o, option) {
                                    var chkField = element.find('#chk' + scope.id + option[scope.ngValueField]);
                                    chkField.bootstrapSwitch({
                                        disabled: !scope.enabled || (option[scope.ngDisabledField] || false),
                                        state: (scope.ngModel || []).indexOf(option[scope.ngValueField]) !== -1
                                    });

                                    chkField.on('switchChange.bootstrapSwitch', function (event, state) {
                                        if (initiated) {
                                            if (state === true) {
                                                if (scope.ngModel.indexOf(option[scope.ngValueField]) === -1)
                                                    scope.ngModel.push(option[scope.ngValueField]);
                                            }
                                            else {
                                                scope.ngModel = _.filter(scope.ngModel, function (x) { return x !== option[scope.ngValueField]; });
                                            }

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
                                if ($('.bootstrap-switch-id-chk' + scope.id + option[scope.ngValueField]).length > 0) {
                                    var chkField = element.find('#chk' + scope.id + option[scope.ngValueField]);

                                    var selected = newValue.indexOf(option[scope.ngValueField]) !== -1;
                                    chkField.bootstrapSwitch('state', selected);
                                }
                            });
                        }
                        initiated = true;
                    });

                    scope.$watch('ngEnabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;

                        $(scope.ngOptions).each(function (o, option) {
                            if ($('.bootstrap-switch-id-chk' + scope.id + option[scope.ngValueField]).length > 0) {
                                var chkField = element.find('#chk' + scope.id + option[scope.ngValueField]);

                                if (!scope.enabled) {
                                    chkField.bootstrapSwitch('disabled', true);
                                }
                                else {
                                    chkField.bootstrapSwitch('disabled', option[scope.ngDisabledField]);
                                }
                            }
                        });
                    });

                    if (scope.ngModel)
                        initiated = true;
                },
                templateUrl: 'tmpl/partial/controls/ctrlCheckList.html' 
            };

        });

})();