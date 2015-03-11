/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DashboardController', function ($scope, $jsnbt, $location) {
        
            $scope.publicTmpl = null;

            if ($jsnbt.injects.dashboard)
                $scope.publicTmpl = $jsnbt.injects.dashboard;

        });
})();