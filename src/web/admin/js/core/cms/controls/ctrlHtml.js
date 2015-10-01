/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlHtml', ['$timeout', 'CONTROL_EVENTS', function ($timeout, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngDisabled: '=',
                    ngRequired: '=',
                    ngValidating: '=',
                    ngLabel: '@',
                    ngTip: '@',
                    ngToolbar: '=',
                    ngHeight: '=',
                    ngMaxHeight: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-html');

                    scope.id = Math.random().toString().replace('.', '');
                    scope.valid = true;
                    scope.enabled = true;

                    var editorId = 'editor_' + scope.id;
             
                    $timeout(function () {
                        var $editor = $('#' + editorId);

                        var updating = false;

                        var opts = {
                            buttons: ['formatting', 'bold', 'italic', 'deleted',
                                'unorderedlist', 'orderedlist', 'outdent', 'indent',
                                'image', 'file', 'link', 'alignment', 'horizontalrule']
                        };

                        var options = {
                            minHeight: scope.ngHeight,
                            maxHeight: scope.ngMaxHeight || scope.ngHeight,
                            buttons: scope.ngToolbar
                        };

                        $.extend(opts, options, {
                            changeCallback: function () {
                                if (!updating) {
                                    scope.ngModel = this.code.get();
                                    scope.changed();
                                }
                            }
                        })

                        $editor.redactor(opts);

                        scope.$watch('ngValidating', function (newValue) {
                            if (initiated)
                                if (newValue === false)
                                    scope.valid = true;
                                else
                                    scope.valid = isValid();
                        });

                        scope.$watch('ngDisabled', function (newValue) {
                            scope.enabled = newValue !== undefined ? newValue : true;

                            var editableContainer = $('.redactor-editor', element);
                            editableContainer.prop('contenteditable', scope.enabled);
                        });

                        var initiated = false;

                        scope.changed = function () {
                            $timeout(function () {
                                scope.$emit(CONTROL_EVENTS.valueChanged, scope.ngModel);
                            }, 50);
                        };

                        var isValid = function () {
                            var valid = true;

                            var validating = scope.ngValidating !== false;
                            if (validating && scope.enabled) {

                                if (valid) {
                                    if (scope.ngRequired) {
                                        valid = !!scope.ngModel && scope.ngModel !== '';
                                    }
                                }

                            }

                            return valid;
                        };

                        scope.$watch('ngModel', function (value) {

                            if (value !== $editor.redactor('code.get')) {
                                updating = true;
                                $editor.redactor('code.set', (value || ''));
                                $timeout(function () {
                                    updating = false;
                                }, 100);
                            }

                            if (initiated)
                                scope.valid = isValid();
                        });

                        scope.$on(CONTROL_EVENTS.initiateValidation, function (sender) {
                            initiated = true;
                            scope.valid = isValid();
                            scope.$emit(CONTROL_EVENTS.valueIsValid, scope.valid);
                        });

                        $editor.redactor('code.set', (scope.ngModel || ''));

                    });
                },
                templateUrl: 'tmpl/core/controls/ctrlHtml.html'
            };

        }]);

})();