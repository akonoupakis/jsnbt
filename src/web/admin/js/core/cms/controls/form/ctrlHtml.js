/* global angular:false */

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

                    deferred.resolve(valid);
                });

                return deferred.promise;
            };

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
                    ngMaxHeight: '=',
                    ngChangeFn: '='
                },
                link: function (scope, element, attrs) {
                    return new HtmlControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/form/ctrlHtml.html'
            };

        }]);

})();