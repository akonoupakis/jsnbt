/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ContentController', function ($scope, $jsnbt, $location) {

            $scope.goto = function (name) {
                $location.next('/content/' + name);
            };
            
            $scope.publicTmpl = null;

            if ($jsnbt.specs.content)
                $scope.publicTmpl = $jsnbt.specs.content;

        });
})();