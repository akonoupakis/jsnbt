/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DashboardController', function ($scope, $jsnbt, $location) {
        
            $scope.publicTmpl = null;

            var injects = [];
            _.each($jsnbt.injects, function (inject) {
                if (inject.dashboard)
                    injects.push(inject.dashboard);
            });
            $scope.injects = injects;

        });
})();