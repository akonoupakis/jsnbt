/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlCheck', function ($timeout) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngEnabled: '=',
                    ngLabel: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-check');

                    scope.id = Math.random().toString().replace('.', '');

                    scope.changed = function () {
                        $timeout(function () {
                            scope.$emit('changed', scope.ngModel);
                        }, 50);
                    };
                },
                templateUrl: 'tmpl/partial/controls/ctrlCheck.html' 
            };

        });

})();