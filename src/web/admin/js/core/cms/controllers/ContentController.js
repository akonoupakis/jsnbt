/* global angular:false */

(function () {
    "use strict";

    var ContentController = function ($scope, $jsnbt, $location) {
        jsnbt.ControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.items = $jsnbt.content;
    };
    ContentController.prototype = Object.create(jsnbt.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('ContentController', ['$scope', '$jsnbt', '$location', ContentController]);
})();