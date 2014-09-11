/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlText', function ($timeout) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngValidate: '=',
                    ngCharacters: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-text');

                    scope.id = Math.random().toString().replace('.', '');

                    scope.changed = function () {
                        $timeout(function () { 
                            scope.$emit('changed', scope.ngModel);
                        }, 50);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.ngEnabled === undefined || scope.ngEnabled === true) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }

                            if (valid) {
                                if (scope.ngValidate) {
                                    valid = scope.ngValidate(scope.ngModel);
                                }
                            }
                        }

                        if (!valid)
                            element.addClass('invalid');
                        else
                            element.removeClass('invalid');

                        return valid;
                    };

                    scope.$on('validate', function (sender) {
                        scope.$emit('valid', isValid());
                    });

                    scope.isValid = function () {
                        return isValid();
                    };

                },
                templateUrl: 'tmpl/partial/controls/ctrlText.html' 
            };

        })
        .directive('ctrlTextAllowed', function () {

            return {
                restrict: "A",
                link: function ($scope, $element, $attrs) {
                    var chars = ($scope.ngCharacters || '').split('');
                    if (chars.length > 0) {
                        $element.on("keypress", function (event) {
                            var char = String.fromCharCode(event.which);
                            if (chars.indexOf(char) === -1)
                                event.preventDefault();
                        });
                    }
                }
            };

        });

})();