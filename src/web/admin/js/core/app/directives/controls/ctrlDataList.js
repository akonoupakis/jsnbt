﻿/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlDataList', function ($timeout, $data, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDomain: '=',
                    ngEntities: '=',
                    ngEnabled: '=',
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
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                    var initiated = false;

                    scope.$watch('ngEnabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;

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

                        if (scope.enabled) {

                            if (valid) {
                                if (scope.ngRequired) {
                                    valid = !!scope.ngModel && scope.ngModel.length > 0;
                                }
                            }

                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        
                        if (newValue && newValue.length > 0) {

                            $data.data.get({ id: { $in: newValue } }).then(function (results) {
                                var scopeValues = [];

                                $(newValue).each(function (nv, nValue) {
                                    var result = _.first(_.filter(results, function (x) { return x.id === nValue; }));
                                    if (result) {
                                        scopeValues.push({
                                            id: result.id,
                                            name: result.name
                                        });
                                    }
                                    else {
                                        scopeValues.push({
                                            id: nValue,
                                            name: nValue + ' (not found)'
                                        });
                                    }
                                });

                                scope.value = scopeValues;

                                if (initiated)
                                    scope.valid = isValid();

                            }, function (error) {
                                throw error;
                            });
                        }
                        else {
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

                    scope.select = function () {
                        if (!scope.ngDomain || scope.ngDomain === '')
                            return;

                        ModalService.open({
                            title: 'select the data items you want',
                            controller: 'DataSelectorController',
                            selected: scope.ngModel,
                            template: 'tmpl/core/modals/dataSelector.html',
                            domain: scope.ngDomain,
                            list: scope.ngList,
                            mode: 'multiple'
                        }).then(function (results) {
                            scope.ngModel = results || [];
                            scope.changed();
                        });
                    };

                    scope.clear = function (node) {
                        var nodeId = node.id;
                        scope.ngModel = _.filter(scope.ngModel, function (x) { return x !== nodeId; });
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
                templateUrl: 'tmpl/core/controls/ctrlDataList.html'
            };

        });

})();