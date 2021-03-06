﻿/* global angular:false */

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
            
            CheckControl.prototype.destroy = function () {
                jsnbt.controls.ControlBase.prototype.destroy.apply(this, arguments);

                this.element.find('input[type="checkbox"]').bootstrapSwitch('destroy');
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                }),
                link: function (scope, element, attrs) {
                    var control = new CheckControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlCheck.html'
            };

        }]);

})();