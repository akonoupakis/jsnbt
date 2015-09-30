﻿/* global angular:false */

(function () {
    "use strict";

    var DashboardController = function ($scope, $jsnbt) {
        jsnbt.ControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.breadcrumb = false;

        var injects = [];
        _.each($jsnbt.injects, function (inject) {
            if (inject.dashboard)
                injects.push(inject.dashboard);
        });
        $scope.injects = injects;

    };
    DashboardController.prototype = Object.create(jsnbt.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DashboardController', ['$scope', '$jsnbt', DashboardController]);
})();