/* global angular:false */

(function () {
    "use strict";

    angular.module('jsnbt')
        .directive('ctrlLanguageSelector', ['$document', '$timeout',
            function ($document, $timeout) {
                return {
                    restrict: 'E',
                    replace: true,
                    scope: {
                        ngModel: '=',
                        ngOptions: '=',
                        ngValueField: '@',
                        ngTextField: '@',
                        ngImageField: '@'
                    },
                    link: function (scope, element, attrs) {
                        element.addClass('ctrl');
                        element.addClass('ctrl-language-selector');

                        scope.valueField = scope.ngValueField || 'code';
                        scope.textField = scope.ngTextField || 'name';
                        scope.imageField = scope.ngImageField || 'image';

                        scope.optionCodes = {};

                        scope.opened = false;

                        scope.$watch('ngOptions', function () {
                            _.each(scope.ngOptions, function (option) {
                                scope.optionCodes[option[scope.valueField]] = option;
                            });
                        });

                        var documentClickHandler = function () {
                            closePopup();
                            scope.$apply();
                        };
                        var documentKeyHandler = function (evt) {
                            if (evt.keyCode === 27) {
                                closePopup();
                                scope.$apply();
                            }
                        };

                        var openPopup = function () {
                            if (!scope.opened) {
                                scope.opened = true;
                                $document.on('click', documentClickHandler);
                                $document.on('keydown', documentKeyHandler);
                            }
                            return false;
                        };

                        var closePopup = function () {
                            if (scope.opened) {
                                $document.off('click', documentClickHandler);
                                $document.off('keydown', documentKeyHandler);
                                scope.opened = false;
                            }
                            return false;
                        };

                        scope.onClick = function (evt) {
                            evt.stopPropagation();
                            if (!scope.opened) {
                                openPopup();
                            } else {
                                closePopup();
                            }
                            return false;
                        };

                        scope.select = function (option) {
                            scope.ngModel = option[scope.valueField];
                        };
                    },
                    templateUrl: 'tmpl/core/controls/ctrlLanguageSelector.html'
                };

            }]);

})();