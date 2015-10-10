/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCheck', ['$rootScope', '$timeout', 'CONTROL_EVENTS', function ($rootScope, $timeout, CONTROL_EVENTS) {

            var CheckControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-check');

                scope.enabled = !scope.ngDisabled;

                var initiating = true;
                var initiated = false;

                scope.$watch('ngDisabled', function (newValue) {
                    scope.enabled = !newValue;

                    setTimeout(function () {
                        element.find('input[type="checkbox"]').bootstrapSwitch('disabled', !scope.enabled);
                    }, 200);
                });

                scope.$watch('ngModel', function (newValue, prevValue) {
                    initiated = false;
                    element.find('input[type="checkbox"]').bootstrapSwitch('state', newValue || false);
                    initiated = true;
                });

                element.find('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function (event, state) {
                    if (!initiating && initiated && self.initiated) {
                        scope.ngModel = state;

                        scope.$apply();

                        scope.changed();
                    }
                });
                
                self.init(300).then(function () {
                    if (scope.ngModel)
                        initiated = true;

                    initiating = false;
                });
            };
            CheckControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);
            
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
                    return new CheckControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlCheck.html'
            };

        }]);

})();