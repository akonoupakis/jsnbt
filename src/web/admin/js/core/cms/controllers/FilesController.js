/* global angular:false */

(function () {
    "use strict";

    var FilesController = function ($scope, $logger) {
        jsnbt.controllers.ControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('FilesController');

    };
    FilesController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('FilesController', ['$scope', '$logger', FilesController]);
})();