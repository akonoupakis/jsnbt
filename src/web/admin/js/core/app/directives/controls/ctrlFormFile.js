/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlFormFile', function ($timeout, ModalService, FORM_EVENTS) {

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
                    element.addClass('ctrl-form-file');

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

                        }

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) { 
                        scope.value = newValue || '';

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
                            title: 'Select a file',
                            controller: 'FileSelectorController',
                            selected: scope.ngModel,
                            mode: 'single',
                            template: 'tmpl/core/partial/modal/fileSelector.html',
                            extensions: scope.ngExtensions || []
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
                templateUrl: 'tmpl/core/partial/controls/ctrlFormFile.html'
            };

        });

})();