/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlTextArea', function () {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngRequired: '=',
                    ngLabel: '@',
                    ngRows: '=',
                    ngValidate: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-text-area');

                    scope.id = Math.random().toString().replace('.', '');

                    scope.changed = function () {
                        scope.$emit('changed', scope.ngModel);
                    };

                    var isValid = function () {
                        var valid = true;

                        if (scope.ngEnabled === undefined || scope.ngEnabled === true) {
                            if (scope.ngRequired) {
                                valid = !!scope.ngModel && scope.ngModel !== '';
                            }

                            if (valid) {
                                if (scope.ngValidate) {
                                    valid = scope.ngValidate();
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
                templateUrl: 'tmpl/partial/controls/ctrlTextArea.html' 
            };

        });

})();