/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlImage', ['$timeout', 'ModalService', 'CONTROL_EVENTS', function ($timeout, ModalService, CONTROL_EVENTS) {

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
                    ngValidating: '=',
                    ngExtensions: '=',
                    ngHeight: '=',
                    ngWidth: '=',
                    ngChangeFn: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-image');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = '';
                    scope.valid = true;
                    scope.wrong = false;
                    scope.extensions = scope.ngExtensions ? scope.ngExtensions : ['.png', '.jpg', '.jpeg', '.gif', '.tiff'];

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

                    var fileGroup = scope.ngFileGroup ? scope.ngFileGroup : 'public';

                    var isValid = function () {
                        var valid = true;

                        var validating = scope.ngValidating !== false;
                        if (validating && !scope.ngDisabled && element.is(':visible')) {

                            if (valid) {
                                if (scope.ngRequired) {
                                    if (!scope.ngModel)
                                        valid = false;
                                    else if (!_.isObject(scope.ngModel)) 
                                        valid = false;
                                    else {
                                        if (!scope.ngModel.src)
                                            valid = false;
                                        else if (scope.ngModel.src === '')
                                            valid = false;
                                    }
                                }

                                if (scope.ngModel) {
                                    if (!_.isObject(scope.ngModel))
                                        valid = false;
                                    else {
                                        if (!scope.ngModel.src)
                                            valid = false;
                                        else if (!_.isArray(scope.ngModel.gen))
                                            valid = false;
                                        else if (scope.ngModel.gen.length !== 2)
                                            valid = false;
                                        else {
                                            if (scope.ngHeight) {
                                                if (scope.ngModel.gen[1].options.height !== scope.ngHeight)
                                                    valid = false;
                                            }
                                            if (scope.ngWidth) {
                                                if (scope.ngModel.gen[1].options.width !== scope.ngWidth)
                                                    valid = false;
                                            }
                                        }
                                    }
                                }
                            }

                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        if (newValue) {
                            if (_.isObject(newValue)) {
                                scope.value = newValue.src || '';
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

                    scope.edit = function () {
                        ModalService.open({
                            title: 'select and crop the image you want',
                            controller: 'ImageSelectorController',
                            selected: scope.ngModel,
                            group: fileGroup,
                            mode: 'single',
                            template: 'tmpl/core/modals/imageSelector.html',
                            extensions: scope.extensions,
                            step: 1,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        }).then(function (result) {
                            scope.ngModel = result;
                            scope.changed();
                        });
                    };

                    scope.crop = function () {
                        ModalService.open({
                            title: 'crop ' + scope.ngModel.src,
                            controller: 'ImageSelectorController',
                            selected: scope.ngModel,
                            group: fileGroup,
                            mode: 'single',
                            template: 'tmpl/core/modals/imageSelector.html',
                            extensions: scope.extensions,
                            step: 2,
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

        }]);

})();