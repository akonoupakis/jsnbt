/* global angular:false */

(function () {
    "use strict";

    var ContentController = function ($scope, $rootScope, $jsnbt, $location) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        $scope.items = $jsnbt.content;
    };
    ContentController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('ContentController', ['$scope', '$rootScope', '$jsnbt', '$location', ContentController]);
})();