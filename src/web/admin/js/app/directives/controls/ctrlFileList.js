/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlFileList', function ($timeout, ModalService) {

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
                    element.addClass('ctrl-file-list');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.value = [];
                    
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
                                valid = !!scope.ngModel && scope.ngModel.length > 0;
                            }
                        }

                        if (!valid)
                            element.addClass('invalid');
                        else
                            element.removeClass('invalid');

                        return valid;
                    };

                    scope.$watch('ngModel', function (newValue, prevValue) {
                        scope.value = typeof(newValue) === 'object' ? newValue || [] : [];
                    });

                    scope.$on('validate', function (sender) {
                        scope.$emit('valid', isValid());
                    });

                    scope.isValid = function () {
                        return isValid();
                    };

                    scope.select = function () {
                        ModalService.open({
                            title: 'Select the files you want',
                            selected: scope.ngModel,
                            template: 'tmpl/partial/modal/FileSelector.html',
                            mode: 'multiple'
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
                templateUrl: 'tmpl/partial/controls/ctrlFileList.html' 
            };

        });

})();