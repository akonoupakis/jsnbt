/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlContainerList', ['$timeout', '$jsnbt', 'ModalService', 'CONTROL_EVENTS', function ($timeout, $jsnbt, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-data-list');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = [];
                    scope.valid = true;
                    scope.empty = false;

                    scope.invalid = {};
                    scope.wrong = {};
                    scope.missing = {};

                    var initiated = false;

                    scope.$watch('ngDisabled', function (newValue) {
                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;
                        scope.empty = false;

                        if (!scope.ngDisabled) {

                            if (valid) {

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
                                            else if (scope.wrong[i] && scope.missing[i]) {
                                                valid = false;
                                                scope.invalid[i] = true;
                                            }
                                        });

                                    }

                                }

                            }

                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue) {
                            if (_.isArray(newValue)) {

                                scope.wrong = {};
                                scope.missing = {};

                                var scopeValues = [];

                                $(newValue).each(function (nv, nValue) {
                                    if (_.isString(nValue)) {
                                        
                                        scope.wrong[nv] = false;

                                        var selectedContainer = $jsnbt.containers[nValue.id];

                                        if (selectedContainer) {
                                            scopeValues.push({
                                                id: nValue,
                                                name: selectedContainer.name
                                            });
                                        }
                                        else {
                                            scopeValues.push({
                                                id: nValue,
                                                name: nValue
                                            });
                                        }

                                        if (!selectedContainer)
                                            scope.missing[nv] = true;
                                    }
                                    else {
                                        scopeValues.push({
                                            id: nValue,
                                            name: nValue
                                        });

                                        scope.wrong[nv] = true;
                                    }
                                });

                                scope.value = scopeValues;

                                if (initiated)
                                    scope.valid = isValid();
                            }
                            else {
                                scope.wrong = {};
                                scope.missing = {};
                                scope.value = [];

                                if (initiated)
                                    scope.valid = isValid();
                            }
                        }
                        else {
                            scope.wrong = {};
                            scope.missing = {};
                            scope.value = [];

                            if (initiated)
                                scope.valid = isValid();
                        }
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });

                    scope.edit = function (index) {
                        var item = scope.ngModel[index];

                        ModalService.open({
                            title: 'select the container item you want',
                            controller: 'ContainerSelectorController',
                            selected: item,
                            template: 'tmpl/core/modals/containerSelector.html',
                            mode: 'single'
                        }).then(function (result) {
                            scope.ngModel[index] = result;
                            scope.ngModel = scope.ngModel.slice(0);

                            if (initiated)
                                scope.valid = isValid();

                            scope.changed();
                        });
                    };

                    scope.add = function () {
                        ModalService.open({
                            title: 'select the container items you want',
                            controller: 'ContainerSelectorController',
                            template: 'tmpl/core/modals/containerSelector.html',
                            mode: 'multiple'
                        }).then(function (results) {
                            if (!scope.ngModel)
                                scope.ngModel = [];

                            $(results).each(function (i, item) {
                                scope.ngModel.push(item);
                            });

                            scope.ngModel = scope.ngModel.slice(0);

                            if (initiated)
                                scope.valid = isValid();

                            scope.changed();
                        });
                    };

                    scope.clear = function (index) {
                        var newValue = [];

                        $(scope.ngModel).each(function (i, item) {
                            if (i !== index) {
                                newValue.push(item);
                            }
                        });

                        scope.ngModel = newValue;
                        scope.changed();
                    };

                    scope.sortableOptions = {
                        axis: 'v',

                        handle: '.glyphicon-move',
                        cancel: '',
                        containment: "parent",

                        stop: function (e, ui) {
                            var nodeIds = scope.value.map(function (x) {
                                return x.id;
                            });
                        
                            scope.ngModel = nodeIds;
                            scope.changed();
                        }
                    };

                },
                templateUrl: 'tmpl/core/controls/ctrlContainerList.html'
            };

        }]);

})();