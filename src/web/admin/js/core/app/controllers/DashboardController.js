/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DashboardController', function ($scope, $jsnbt, $location) {
        
            $scope.publicTmpl = null;

            if ($jsnbt.specs.dashboard)
                $scope.publicTmpl = $jsnbt.specs.dashboard;

        });
})();