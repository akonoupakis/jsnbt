/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ContentController', function ($scope, $location) {

            $scope.goto = function (name) {
                $location.next('/content/' + name);
            };

        });
})();