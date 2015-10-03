/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlSelectList', ['$timeout', 'ModalService', 'CONTROL_EVENTS', function ($timeout, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngOptions: '=',
                    ngDefault: '=',
                    ngValueField: '@',
                    ngNameField: '@',
                    ngValidating: '=',
                    ngChangeFn: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-select-list');

                    scope.valueField = scope.ngValueField ? scope.ngValueField : 'value';
                    scope.nameField = scope.ngNameField ? scope.ngNameField : 'name';

                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    scope.empty = false;
                    
                    scope.invalid = {};
                    scope.wrong = {};

                    var initiated = false;

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

                            if (scope.ngModel) {
                                if (!_.isArray(scope.ngModel))
                                    valid = false;
                                else {

                                    $(scope.ngModel).each(function (i, item) {
                                        scope.invalid[i] = false;
                                        if (!item) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                        else if (!_.isString(item)) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                        else if (!_.any(scope.ngOptions, function (x) {
                                               return x[scope.valueField] === item;
                                        })) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                    });

                                }
                            }
                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue) {
                            if (_.isArray(newValue)) {
                                scope.wrong = {};
                                scope.value = newValue;
                                $(newValue).each(function (i, item) {
                                    scope.wrong[i] = false;

                                    if (!item) {
                                        scope.wrong[i] = true;
                                    }
                                    else if (typeof (item) !== 'string') {
                                        scope.wrong[i] = true;
                                    }
                                    else if (!_.any(scope.ngOptions, function(x){
                                        return x[scope.valueField] === item;
                                    })) {
                                        scope.wrong[i] = true;
                                    }
                                });
                            }
                            else {
                                scope.wrong = {};
                                scope.value = [];
                            }
                        }
                        else {
                            scope.wrong = {};
                            scope.value = [];
                        }

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
                        scope.ngModel.push('');

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
                templateUrl: 'tmpl/core/controls/ctrlSelectList.html'
            };

        }]);

})();