/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlBreadcrumb', function ($location) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngTitle: '@'
                },
                link: function (scope, element, attrs) {
                    element.addClass('breadcrumb');
                    element.addClass('ctrl-breadcrumb');

                    scope.previousTo = function (path) {
                        $location.previous(path);
                    };
                },
                templateUrl: 'tmpl/core/controls/ctrlBreadcrumb.html'
            };

        });

})();