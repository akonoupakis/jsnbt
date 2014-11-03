/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCheck', function ($timeout, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngLabel: '@',
                    ngTip: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-check');
                    
                    scope.id = Math.random().toString().replace('.', '');
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                    var initiating = true;
                    var initiated = false;
                    
                    scope.$watch('ngModel', function (newValue, prevValue) {
                        initiated = false;
                        element.find('input[type="checkbox"]').bootstrapSwitch('state', newValue || false);
                        initiated = true;
                    });

                    scope.$watch('ngEnabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;
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
                                scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
                            }, 50);
                        }
                    });

                    if (scope.ngModel)
                        initiated = true;

                    setTimeout(function () {
                        initiating = false;
                    }, 300);
                },
                templateUrl: 'tmpl/partial/controls/ctrlCheck.html' 
            };

        });

})();