/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlBreadcrumb', ['$rootScope', '$location', function ($rootScope, $location) {

            var BreadcrumbControl = function (scope, element, attrs) {
                jsnbt.controls.ControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                element.addClass('breadcrumb');
                element.addClass('ctrl-breadcrumb');

                scope.previousTo = function (path) {
                    $location.previous(path);
                };

                scope.visible = function (item) {
                    return item.visible !== false;
                };
            };
            BreadcrumbControl.prototype = Object.create(jsnbt.controls.ControlBase.prototype);

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '=',
                    ngTitle: '='
                },
                link: function (scope, element, attrs) {
                    return new BreadcrumbControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/ctrlBreadcrumb.html'
            };

        }]);

})();