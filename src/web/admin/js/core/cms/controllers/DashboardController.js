/* global angular:false */

(function () {
    "use strict";

    var DashboardController = function ($scope, $rootScope, $jsnbt) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        $scope.breadcrumb = false;

        var injects = [];
        _.each($jsnbt.injects, function (inject) {
            if (inject.dashboard)
                injects.push(inject.dashboard);
        });
        $scope.injects = injects;

    };
    DashboardController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DashboardController', ['$scope', '$rootScope', '$jsnbt', DashboardController]);
})();