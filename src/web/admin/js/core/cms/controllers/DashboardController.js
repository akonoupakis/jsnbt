/* global angular:false */

(function () {
    "use strict";

    var DashboardController = function ($scope, $rootScope, $jsnbt, $logger) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('DashboardController');

        $scope.breadcrumb = false;

        var injects = [];
        _.each($jsnbt.injects, function (inject) {
            if (inject.dashboard)
                injects.push(inject.dashboard);
        });
        $scope.injects = injects;

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    DashboardController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DashboardController', ['$scope', '$rootScope', '$jsnbt', '$logger', DashboardController]);
})();