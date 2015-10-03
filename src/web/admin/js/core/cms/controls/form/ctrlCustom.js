/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCustom', ['$timeout', 'CONTROL_EVENTS', function ($timeout, CONTROL_EVENTS) {

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
                compile: function (elem, attrs, transclude) {

                    return function (scope, lElem, lAttrs) {
                        lElem.addClass('ctrl');
                        lElem.addClass('ctrl-custom');

                        scope.id = Math.random().toString().replace('.', '');
                        scope.valid = true;

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
                    };
                },
                templateUrl: 'tmpl/core/controls/ctrlCustom.html'
            };

        }]);

})();