/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlImageList', ['$timeout', 'ModalService', 'CONTROL_EVENTS', function ($timeout, ModalService, CONTROL_EVENTS) {

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
                    ngExtensions: '=',
                    ngHeight: '=',
                    ngWidth: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-image-list');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = [];
                    scope.valid = true;
                    scope.empty = false;
                    scope.extensions = scope.ngExtensions ? scope.ngExtensions : ['.png', '.jpg', '.jpeg', '.gif', '.tiff'];

                    scope.invalid = {};
                    scope.wrong = {};

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
                        scope.empty = false;

                        if (!scope.ngDisabled) {

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
                                        if (!item.src) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                        else if (!_.isArray(item.gen)) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                        else if (item.gen.length !== 2) {
                                            valid = false;
                                            scope.invalid[i] = true;
                                        }
                                        else {
                                            if (scope.ngHeight) {
                                                if (item.gen[1].options.height !== scope.ngHeight) {
                                                    valid = false;
                                                    scope.invalid[i] = true;
                                                }
                                            }
                                            if (scope.ngWidth) {
                                                if (item.gen[1].options.width !== scope.ngWidth) {
                                                    valid = false;
                                                    scope.invalid[i] = true;
                                                }
                                            }
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

                                    if (!item.src) {
                                        scope.wrong[i] = true;
                                    }
                                    else if (!_.isArray(item.gen)) {
                                        scope.wrong[i] = true;
                                    }
                                    else if (item.gen.length !== 2) {
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
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.edit = function (index) {
                        var item = scope.ngModel[index];

                        ModalService.open({
                            title: 'select and crop the image you want',
                            controller: 'ImageSelectorController',
                            selected: item,
                            template: 'tmpl/core/modals/ImageSelector.html',
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 1,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        }).then(function (result) {
                            scope.ngModel[index] = result;
                            scope.ngModel = scope.ngModel.slice(0);

                            if (initiated)
                                scope.valid = isValid();

                            scope.changed();
                        });
                    };

                    scope.crop = function (index) {
                        var item = scope.ngModel[index];

                        ModalService.open({
                            title: 'crop ' + scope.ngModel.src,
                            controller: 'ImageSelectorController',
                            selected: item,
                            template: 'tmpl/core/modals/ImageSelector.html',
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 2,
                            height: scope.ngHeight,
                            width: scope.ngWidth
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
                            title: 'select and crop the image you want',
                            controller: 'ImageSelectorController',
                            template: 'tmpl/core/modals/ImageSelector.html',
                            group: fileGroup,
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 1,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        }).then(function (result) {
                            if (!scope.ngModel)
                                scope.ngModel = [];

                            scope.ngModel.push(result);
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
                            var files = scope.value.map(function (x) {
                                return x;
                            });
                        
                            scope.ngModel = files;
                            scope.changed();
                        }
                    };

                },
                templateUrl: 'tmpl/core/controls/ctrlImageList.html'
            };

        }]);

})();