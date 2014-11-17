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
                    ngListId: '=',
                    ngDisabled: '=',
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
                    scope.wrong = false;
                    scope.missing = false;

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

                        if (!scope.ngDisabled) {

                            if (valid) {
                                if (scope.ngRequired) {
                                    if (!scope.ngModel)
                                        valid = false;
                                    else if (!_.isString(scope.ngModel))
                                        valid = false;
                                    else if (scope.ngModel === '')
                                        valid = false;
                                }

                                if (scope.ngModel) {
                                    if (!_.isString(scope.ngModel))
                                        valid = false;
                                    else if (scope.wrong && scope.missing)
                                        valid = false;
                                }
                            }
                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue) {
                            if (_.isString(newValue)) {
                                if (newValue !== '') {
                                    $data.data.get({
                                        domain: scope.ngDomain,
                                        list: scope.ngListId,
                                        id: newValue
                                    }).then(function (response) {
                                        scope.value = response.name;
                                        scope.wrong = false;
                                        scope.missing = false;

                                        if (initiated)
                                            scope.valid = isValid();
                                    }, function (error) {
                                        scope.value = newValue;
                                        scope.wrong = true;
                                        scope.missing = true;

                                        if (initiated)
                                            scope.valid = isValid();
                                    });
                                }
                            }
                            else {
                                scope.value = '';
                                scope.wrong = true;
                                scope.missing = false;

                                if (initiated)
                                    scope.valid = isValid();
                            }
                        }
                        else {
                            scope.value = '';
                            scope.wrong = false;
                            scope.missing = false;

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
                            list: scope.ngListId,
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