/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlImageList', function ($timeout, ModalService, CONTROL_EVENTS) {

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
                    element.addClass('ctrl-image-list');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = [];
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
                            scope.ngModel = scope.ngModel || [];
                            if (valid) {
                                if (scope.ngRequired) {
                                    valid = scope.ngModel.length > 0;
                                }
                            }

                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        scope.value = typeof (newValue) === 'object' ? newValue || [] : [];

                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.edit = function (item) {
                        var itemSrc = item.src;
                        ModalService.open({
                            title: 'select the files you want',
                            controller: 'ImageSelectorController',
                            selected: item,
                            template: 'tmpl/core/modals/ImageSelector.html',
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 1,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        }).then(function (result) {
                            var matched = _.find(scope.ngModel, function (x) { return x.src === itemSrc; });                            
                            if (matched) {
                                matched.src = result.src;
                                matched.gen = result.gen.slice(0);
                            }

                            if (initiated)
                                scope.valid = isValid();

                            scope.changed();
                        });
                    };

                    scope.crop = function (item) {
                        var itemSrc = item.src;
                        ModalService.open({
                            title: 'select the files you want',
                            controller: 'ImageSelectorController',
                            selected: item,
                            template: 'tmpl/core/modals/ImageSelector.html',
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 2,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        }).then(function (result) {
                            var matched = _.find(scope.ngModel, function (x) { return x.src === itemSrc; });
                            if (matched) {
                                matched.gen = result.gen.slice(0);
                            }

                            if (initiated)
                                scope.valid = isValid();

                            scope.changed();
                        });
                    };

                    scope.add = function () {
                        ModalService.open({
                            title: 'select the files you want',
                            controller: 'ImageSelectorController',
                            template: 'tmpl/core/modals/ImageSelector.html',
                            mode: 'single',
                            extensions: scope.extensions,
                            step: 1,
                            height: scope.ngHeight,
                            width: scope.ngWidth
                        }).then(function (result) {
                            if (!scope.ngModel)
                                scope.ngModel = [];

                            scope.ngModel.push(result);

                            if (initiated)
                                scope.valid = isValid();

                            scope.changed();
                        });
                    };

                    scope.clear = function (file) {
                        scope.ngModel = _.filter(scope.ngModel, function (x) { return x.src !== file.src; });
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

        });

})();