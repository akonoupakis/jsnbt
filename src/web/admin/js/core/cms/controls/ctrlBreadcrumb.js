/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlBreadcrumb', ['$rootScope', function ($rootScope) {

            var BreadcrumbControl = function (scope, element, attrs) {
                jsnbt.controls.ControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                element.addClass('breadcrumb');
                element.addClass('ctrl-breadcrumb');

                scope.previousTo = function (path) {
                    scope.$parent.route.previous(path);
                };

                scope.visible = function (item) {
                    return item.visible !== false;
                };
            };
            BreadcrumbControl.prototype = Object.create(jsnbt.controls.ControlBase.prototype);

            return {
                restrict: 'E',
                replace: true,
                scope: $.extend(true, jsnbt.controls.ControlBase.prototype.properties, {
                    ngModel: '=',
                    ngTitle: '='
                }),
                link: function (scope, element, attrs) {
                    return new BreadcrumbControl(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/controls/ctrlBreadcrumb.html'
            };

        }]);

})();