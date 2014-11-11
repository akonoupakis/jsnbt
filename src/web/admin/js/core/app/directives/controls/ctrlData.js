/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlData', function ($timeout, $data, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDomain: '=',
                    ngList: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-data');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = '';
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
                                    valid = !!scope.ngModel && scope.ngModel !== '';
                                }
                            }
                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) { 
                        if (newValue && newValue !== '') {
                            $data.data.get(newValue).then(function (response) {
                                scope.value = response.name;

                                if (initiated)
                                    scope.valid = isValid();
                            }, function (error) {
                                throw error;
                            });
                        }
                        else {
                            scope.value = '';

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
                            title: 'select a data item',
                            controller: 'DataSelectorController',
                            selected: scope.ngModel,
                            template: 'tmpl/core/modals/dataSelector.html',
                            domain: scope.ngDomain,
                            list: scope.ngList,
                            mode: 'single'
                        }).then(function (result) {
                            scope.ngModel = result || '';
                            scope.changed();
                        });
                    };

                    scope.clear = function () {
                        scope.ngModel = '';
                        scope.changed();
                    };

                },
                templateUrl: 'tmpl/core/controls/ctrlData.html'
            };

        });

})();