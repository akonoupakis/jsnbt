/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlFileList', function ($timeout, ModalService, FORM_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngExtensions: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-file-list');

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
                            scope.$emit(FORM_EVENTS.valueChanged, scope.ngModel);
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
                        scope.value = typeof (newValue) === 'object' ? newValue || [] : [];

                        if (initiated)
                            scope.valid = isValid();
                    });

                    scope.$on(FORM_EVENTS.initiateValidation, function (sender) {
                        initiated = true;
                        scope.valid = isValid();
                        scope.$emit(FORM_EVENTS.valueIsValid, scope.valid);
                    });
                    
                    scope.select = function () {
                        ModalService.open({
                            title: 'Select the files you want',
                            controller: 'FileSelectorController',
                            selected: scope.ngModel,
                            template: 'tmpl/core/partial/modal/FileSelector.html',
                            mode: 'multiple',
                            extensions: scope.ngExtensions || []
                        }).then(function (results) {
                            scope.ngModel = results || [];
                            scope.changed();
                        });
                    };

                    scope.clear = function (file) {
                        scope.ngModel = _.filter(scope.ngModel, function (x) { return x !== file; });
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
                templateUrl: 'tmpl/core/partial/controls/ctrlFileList.html'
            };

        });

})();