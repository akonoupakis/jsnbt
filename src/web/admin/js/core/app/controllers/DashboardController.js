/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DashboardController', ['$scope', '$jsnbt', function ($scope, $jsnbt) {
        
            $scope.publicTmpl = null;

            var injects = [];
            _.each($jsnbt.injects, function (inject) {
                if (inject.dashboard)
                    injects.push(inject.dashboard);
            });
            $scope.injects = injects;

        }]);
})();