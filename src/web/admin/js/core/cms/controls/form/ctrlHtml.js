﻿/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlHtml', ['$rootScope', '$timeout', '$q', 'CONTROL_EVENTS', function ($rootScope, $timeout, $q, CONTROL_EVENTS) {

            var HtmlControl = function (scope, element, attrs) {
                jsnbt.controls.FormControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                var self = this;

                element.addClass('ctrl');
                element.addClass('ctrl-html');

                scope.enabled = true;

                var editorId = 'editor_' + scope.id;

                $timeout(function () {
                    var $editor = $('#' + editorId);
                    self.editor = $editor;

                    var updating = false;

                    var opts = {
                        buttons: ['formatting', 'bold', 'italic', 'deleted',
                            'unorderedlist', 'orderedlist', 'outdent', 'indent',
                            'image', 'file', 'link', 'alignment', 'horizontalrule']
                    };

                    var options = {
                        minHeight: scope.ngHeight || 60,
                        maxHeight: scope.ngMaxHeight || scope.ngHeight,
                        buttons: scope.ngToolbar
                    };

                    $.extend(opts, options, {
                        changeCallback: function () {
                            if (!updating) {
                                var editorCode = this.code.get();
                                if (scope.ngModel === undefined)
                                    scope.ngModel = '';

                                if (!_.isEqual(editorCode, scope.ngModel)) {
                                    scope.ngModel = this.code.get();
                                    scope.changed();
                                }
                            }
                        }
                    })

                    $editor.redactor(opts);
                    
                    scope.$watch('ngDisabled', function (newValue) {
                        scope.enabled = newValue !== undefined ? newValue : true;

                        var editableContainer = $('.redactor-editor', element);
                        editableContainer.prop('contenteditable', scope.enabled);
                    });
                    
                    scope.$watch('ngModel', function (value) {
                        if (value !== $editor.redactor('code.get')) {
                            updating = true;
                            $editor.redactor('code.set', (value || ''));
                            $timeout(function () {
                                updating = false;
                            }, 100);
                        }

                        self.validate();
                    });

                    $editor.redactor('code.set', (scope.ngModel || ''));

                    self.init();

                });
            };
            HtmlControl.prototype = Object.create(jsnbt.controls.FormControlBase.prototype);

            HtmlControl.prototype.isValid = function () {
                var deferred = $q.defer();

                var self = this;

                jsnbt.controls.FormControlBase.prototype.isValid.apply(this, arguments).then(function (valid) {
                    if (valid && self.isValidating()) {

                        if (self.scope.ngRequired) {
                            valid = !!self.scope.ngModel && self.scope.ngModel !== '';
                        }

                    }

                    self.scope.valid = valid;
                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

            HtmlControl.prototype.destroy = function () {
                jsnbt.controls.ControlBase.prototype.destroy.apply(this, arguments);

                this.editor.redactor('destroy');
            };

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.FormControlBase.prototype.properties, {
                    ngToolbar: '=',
                    ngHeight: '=',
                    ngMaxHeight: '='
                }),
                link: function (scope, element, attrs) {
                    var control = new HtmlControl(scope, element, attrs);
                    scope.$emit(CONTROL_EVENTS.register, control);
                    return control;
                },
                templateUrl: 'tmpl/core/controls/form/ctrlHtml.html'
            };

        }]);

})();