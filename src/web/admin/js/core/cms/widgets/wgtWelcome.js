/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('wgtWelcome', ['$rootScope', function ($rootScope) {

            var WelcomeWidget = function (scope, element, attrs) {
                element.addClass('wgt-welcome');
            };

            return {
                restrict: 'E',
                replace: true,
                link: function (scope, element, attrs) {
                    return new WelcomeWidget(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/widgets/wgtWelcome.html'
            };

        }]);

})();