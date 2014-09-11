/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('breadcrumb', function ($location) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('breadcrumb');

                    scope.previousTo = function (path) {
                        $location.previous(path);
                    };
                },
                templateUrl: 'tmpl/partial/common/breadcrumb.html' 
            };

        });

})();