/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlImage', function ($timeout, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngExtensions: '=',
                    ngHeight: '=',
                    ngWidth: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-image');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = '';
                    scope.valid = true;
                    scope.enabled = scope.ngEnabled !== undefined ? scope.ngEnabled : true;
                    scope.extensions = scope.ngExtensions ? scope.ngExtensions : ['.png', '.jpg', '.jpeg', '.gif', '.tiff'];

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
                                    if (!scope.ngModel)
                                        valid = false;
                                    else if (typeof (scope.ngModel) === 'object') {
                                        if (!scope.ngModel.src)
                                            valid = false;
                                        else if (scope.ngModel.src === '')
                                            valid = false;
                                    }
                                }

                                if (scope.ngModel) {
                                    if (typeof (scope.ngModel) !== 'object')
                                        valid = false;
                                }
                            }

                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue) {
                            if (typeof (newValue) === 'object') {
                                scope.value = newValue.src || '';
                            }
                            else {
                                scope.value = '-- not parsable image --';
                            }
                        }
                        else {
                            scope.value = '';
                        }

                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.select = function (step) {
                        ModalService.open({
                            title: 'select an image',
                            controller: 'ImageSelectorController',
                            selected: scope.ngModel,
                            mode: 'single',
                            template: 'tmpl/core/modals/imageSelector.html',
                            extensions: scope.extensions,
                            step: step,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        }).then(function (result) {
                            scope.ngModel = result;
                            scope.changed();
                        });
                    };

                    scope.clear = function () {
                        scope.ngModel = undefined;
                        scope.changed();
                    };

                },
                templateUrl: 'tmpl/core/controls/ctrlImage.html'
            };

        });

})();