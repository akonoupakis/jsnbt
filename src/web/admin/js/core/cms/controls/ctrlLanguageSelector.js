/* global angular:false */

(function () {
    "use strict";

    angular.module('jsnbt')
        .directive('ctrlLanguageSelector', ['$rootScope', '$document', '$timeout',
            function ($rootScope, $document, $timeout) {

                var LanguageSelectorControl = function (scope, element, attrs) {
                    jsnbt.controls.ControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                    element.addClass('ctrl');
                    element.addClass('ctrl-language-selector');

                    scope.valueField = scope.ngValueField || 'code';
                    scope.textField = scope.ngTextField || 'name';
                    scope.imageField = scope.ngImageField || 'image';

                    scope.optionCodes = {};

                    scope.opened = false;

                    scope.$watch('ngItems', function () {
                        _.each(scope.ngItems, function (option) {
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
                };
                LanguageSelectorControl.prototype = Object.create(jsnbt.controls.ControlBase.prototype);

                return {
                    restrict: 'E',
                    replace: true,
                    scope: $.extend(true, jsnbt.controls.ControlBase.prototype.properties, {
                        ngModel: '=',
                        ngItems: '=',
                        ngValueField: '@',
                        ngTextField: '@',
                        ngImageField: '@'
                    }),
                    link: function (scope, element, attrs) {
                        return new LanguageSelectorControl(scope, element, attrs);
                    },
                    templateUrl: 'tmpl/core/controls/ctrlLanguageSelector.html'
                };

            }]);

})();