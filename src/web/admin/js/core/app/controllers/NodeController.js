/* global angular:false */

(function () {
    "use strict";

    var NodeController = function ($scope, $location) {
        jsnbt.NodeFormControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.back = function () {
            $location.previous('/content/nodes');
        };

        $scope.init();
    };
    NodeController.prototype = Object.create(jsnbt.NodeFormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('NodeController', ['$scope', '$location', NodeController]);
})();