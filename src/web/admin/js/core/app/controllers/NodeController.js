/* global angular:false */

(function () {
    "use strict";

    var NodeController = function ($scope, $location) {
        jsnbt.NodeFormControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.init();
    };
    NodeController.prototype = Object.create(jsnbt.NodeFormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('NodeController', ['$scope', '$location', NodeController]);
})();