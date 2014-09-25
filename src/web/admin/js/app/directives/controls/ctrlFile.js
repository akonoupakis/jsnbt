/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlFile', function ($timeout, ModalService) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-file');

                    

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = '';
                    
                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit('changed', scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.ngEnabled === false)
                            valid = true;

                        if (valid) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }
                        }

                        if (!valid)
                            element.addClass('invalid');
                        else
                            element.removeClass('invalid');

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) { 
                        scope.value = newValue || '';
                    });

                    scope.$on('validate', function (sender) {
                        scope.$emit('valid', isValid());
                    });

                    scope.isValid = function () {
                        return isValid();
                    };

                    scope.select = function () {
                        ModalService.open({
                            title: 'Select a file',
                            controller: 'FileSelectorController',
                            selected: scope.ngModel,
                            mode: 'single',
                            template: 'tmpl/partial/modal/fileSelector.html'
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
                templateUrl: 'tmpl/partial/controls/ctrlFile.html' 
            };

        });

})();