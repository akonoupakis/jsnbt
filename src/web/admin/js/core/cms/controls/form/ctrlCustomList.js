/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCustomList', ['$timeout', 'ModalService', 'CONTROL_EVENTS', function ($timeout, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngValidating: '=',
                    ngScope: '=',
                    ngChangeFn: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-custom-list');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    scope.empty = false;

                    var initiated = false;

                    if (_.isObject(scope.ngScope)) {
                        for (var contextName in scope.ngScope) {
                            scope[contextName] = scope.ngScope[contextName];
                        }
                    }

                    scope.$watch('ngDisabled', function (newValue) {
                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$watch('ngValidating', function (newValue) {
                        if (initiated)
                            if (newValue === false)
                                scope.valid = true;
                            else
                                scope.valid = isValid();
                    });

                    scope.$watch('ngScope', function (newValue, prevValue) {
                        if (_.isObject(newValue)) {
                            for (var contextName in newValue) {
                                scope[contextName] = newValue[contextName];
                            }
                        }
                    }, true);

                    scope.changed = function () {
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
                    };

                    var isValid = function () {
                        var valid = true;
                        scope.empty = false;

                        var validating = scope.ngValidating !== false;
                        if (validating && !scope.ngDisabled && element.is(':visible')) {
                            
                            if (scope.ngRequired) {
                                if (!scope.ngModel) {
                                    valid = false;
                                    scope.empty = true;
                                }
                                else if (!_.isArray(scope.ngModel)) {
                                    valid = false;
                                }
                                else if (scope.ngModel.length === 0) {
                                    valid = false;
                                    scope.empty = true;
                                }
                            }
                        }
                        
                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue === undefined)
                            scope.ngModel = [];

                        if (initiated)
                            scope.valid = isValid();
                    }, true);

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.$on(CONTROL_EVENTS.validate, function (sender) {
                        if (initiated) {
                            scope.valid = isValid();
                        }
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });

                    scope.$on(CONTROL_EVENTS.clearValidation, function (sender) {
                        initiated = false;
                        scope.valid = true;
                    });

                    scope.add = function () {
                        scope.ngModel.push({ });

                        if (initiated)
                            scope.valid = isValid();

                        scope.changed();
                    };

                    scope.clear = function (index) {
                        scope.ngModel.splice(index, 1);
                        scope.changed();
                    };

                    scope.sortableOptions = {
                        axis: 'v',
                            
                        handle: '.glyphicon-move',
                        cancel: '',
                        containment: "parent",

                        stop: function (e, ui) {
                            scope.ngModel = scope.ngModel.map(function (x) {
                                return x;
                            });
                            scope.changed();
                        }
                    };

                },
                templateUrl: 'tmpl/core/controls/ctrlCustomList.html'
            };

        }]);

})();