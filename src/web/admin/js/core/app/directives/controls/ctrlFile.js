/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlFile', function ($timeout, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngFileGroup: '@',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngExtensions: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-file');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = '';
                    scope.valid = true;
                    scope.wrong = false;

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

                    var fileGroup = scope.ngFileGroup ? scope.ngFileGroup : 'public';

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
                                    else if (!_.str.startsWith(scope.ngModel, 'files/'))
                                        valid = false;
                                }

                                if (scope.ngModel) {
                                    if (!_.isString(scope.ngModel))
                                        valid = false;
                                    else if (scope.ngModel === '')
                                        valid = false;
                                    else if (!_.str.startsWith(scope.ngModel, 'files/'))
                                        valid = false;
                                }
                            }

                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue) {
                            if (_.isString(newValue)) {
                                scope.value = newValue;
                                scope.wrong = false;
                            }
                            else {
                                scope.wrong = true;
                                scope.value = '';
                            }
                        }
                        else {
                            scope.value = '';
                            scope.wrong = false;
                        }

                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.select = function () {
                        ModalService.open({
                            title: 'select a file',
                            controller: 'FileSelectorController',
                            selected: scope.ngModel,
                            group: fileGroup,
                            mode: 'single',
                            template: 'tmpl/core/modals/fileSelector.html',
                            extensions: scope.ngExtensions || []
                        }).then(function (result) {
                            scope.ngModel = result;
                            scope.changed();
                        });
                    };

                    scope.clear = function () {
                        scope.ngModel = '';
                        scope.changed();
                    };

                },
                templateUrl: 'tmpl/core/controls/ctrlFile.html'
            };

        });

})();