﻿/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCheck', function ($timeout, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngLabel: '@',
                    ngTip: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-check');
                    
                    scope.id = Math.random().toString().replace('.', '');
                    scope.enabled = !scope.ngDisabled;

                    var initiating = true;
                    var initiated = false;
                    
                    scope.$watch('ngModel', function (newValue, prevValue) {
                        initiated = false;
                        element.find('input[type="checkbox"]').bootstrapSwitch('state', newValue || false);
                        initiated = true;
                    });

                    scope.$watch('ngDisabled', function (newValue) {
                        scope.enabled = !newValue;
                        element.find('input[type="checkbox"]').bootstrapSwitch('disabled', !scope.enabled);
                    });

                    element.find('input[type="checkbox"]').bootstrapSwitch({
                        disabled: !scope.enabled,
                        state: scope.ngModel
                    });

                    element.find('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function (event, state) {
                        if (!initiating && initiated) {
                            scope.ngModel = state;

                            scope.$apply();

                            $timeout(function () {
                                scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                            }, 50);
                        }
                    });

                    if (scope.ngModel)
                        initiated = true;

                    setTimeout(function () {
                        initiating = false;
                    }, 300);
                },
                templateUrl: 'tmpl/core/controls/ctrlCheck.html'
            };

        });

})();