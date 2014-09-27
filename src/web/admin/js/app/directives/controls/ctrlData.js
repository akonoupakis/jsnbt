﻿/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlData', function ($timeout, $data, ModalService, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDomain: '=',
                    ngList: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-data');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.initiated = false;
                    scope.value = '';
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;

                    scope.$watch('ngEnabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;
                    });

                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
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

                            if (!valid)
                                element.addClass('invalid');
                            else
                                element.removeClass('invalid');
                        }
                        else {
                            element.removeClass('invalid');
                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) { 
                        if (newValue && newValue !== '') {
                            $data.data.get(newValue).then(function (response) {
                                scope.value = response.name;
                            }, function (error) {
                                throw error;
                            });
                        }
                        else {
                            scope.value = '';
                        }
                    });

                    scope.$on(FORM_EVENTS.initiateValidation, function (sender) {
                        scope.initiated = true;
                        scope.$emit(FORM_EVENTS.valueIsValid, isValid());
                    });

                    scope.isValid = function () {
                        return isValid();
                    };

                    scope.select = function () {
                        if (!scope.ngDomain || scope.ngDomain === '')
                            return;

                        ModalService.open({
                            title: 'Select a data item',
                            controller: 'DataSelectorController',
                            selected: scope.ngModel,
                            template: 'tmpl/partial/modal/dataSelector.html',
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
                templateUrl: 'tmpl/partial/controls/ctrlData.html' 
            };

        });

})();