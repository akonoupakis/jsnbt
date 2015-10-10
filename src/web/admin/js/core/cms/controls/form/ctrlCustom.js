/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCustom', ['$rootScope', '$timeout', 'CONTROL_EVENTS', function ($rootScope, $timeout, CONTROL_EVENTS) {

            var CustomControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                element.addClass('ctrl');
                element.addClass('ctrl-custom');
                
                scope.value = [scope.ngModel || {}];

                if (_.isObject(scope.ngScope)) {
                    for (var contextName in scope.ngScope) {
                        scope[contextName] = scope.ngScope[contextName];
                    }
                }

                scope.$watch('ngModel', function (newValue, prevValue) {
                    if (newValue === undefined)
                        scope.ngModel = {};

                    if (!_.isEqual([scope.ngModel], scope.value)) {
                        scope.value = [scope.ngModel];
                    }
                });

                scope.$watch('value', function (newValue, prevValue) {
                    if (!_.isEqual([scope.ngModel], newValue)) {
                        scope.ngModel = _.first(newValue);
                    }
                });

                scope.$watch('ngScope', function (newValue, prevValue) {
                    if (_.isObject(newValue)) {
                        for (var contextName in newValue) {
                            scope[contextName] = newValue[contextName];
                        }
                    }
                }, true);

                this.init();
            };
            CustomControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);
            
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngValidating: '=',
                    ngScope: '='
                },
                link: function (scope, element, attrs) {
                    return new CustomControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlCustom.html'
            };

        }]);

})();