/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('login', function ($location) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '='
                },
                template: '<div ng-if="visible" ng-include="\'tmpl/partial/login.html\'">',
                link: function (scope, element, attrs) {
                    element.addClass('login');

                    var showDialog = function () {
                        scope.visible = true;
                    };

                    scope.visible = false;
                    scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
                    scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);

                }
            };

        });

})();