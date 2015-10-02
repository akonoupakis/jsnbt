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

                        var initiated = false;

                        var childScope = scope.$new();

                        var built = false;
                        var build = function () {
                            var container = $('#cstm' + scope.id, lElem);

                            if (container.length > 0 && !built) {

                                console.log('build', container.length);

                                container.empty();

                                childScope.model = scope.ngModel;
                                childScope.ngDisabled = scope.ngDisabled;
                                childScope.ngValidating = scope.ngValidating;

                                if (_.isObject(scope.ngScope)) {
                                    for (var contextName in scope.ngScope) {
                                        childScope[contextName] = scope.ngScope[contextName];
                                    }
                                }

                                childScope.$watch('model', function () {
                                    childScope.$broadcast(CONTROL_EVENTS.validate);
                                });

                                transclude(childScope, function (clone, innerScope) {
                                    container.append(clone);
                                });

                                childScope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
                                    sender.stopPropagation();

                                    scope.$emit(CONTROL_EVENTS.valueIsValid, value);
                                });

                                childScope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                                    initiated = true;
                                });

                                childScope.$on(CONTROL_EVENTS.clearValidation, function (sender) {
                                    initiated = false;
                                });

                                built = true;
                            }
                        };

                        scope.$watch('ngModel', function (newValue, prevValue) {
                            build();

                            childScope.model = newValue;
                        });

                        scope.$watch('ngDisabled', function (newValue, prevValue) {
                            childScope.ngDisabled = newValue;
                        });

                        scope.$watch('ngValidating', function (newValue, prevValue) {
                            childScope.ngValidating = newValue;
                        });

                        scope.$watch('ngScope', function (newValue, prevValue) {
                            if (_.isObject(newValue)) {
                                for (var contextName in newValue) {
                                    childScope[contextName] = newValue[contextName];
                                }
                            }
                        }, true);
                    };
                },
                templateUrl: 'tmpl/core/controls/ctrlCustom.html'
            };

        }]);

})();