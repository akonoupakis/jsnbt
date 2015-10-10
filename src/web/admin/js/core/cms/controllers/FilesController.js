/* global angular:false */

(function () {
    "use strict";

    var FilesController = function ($scope, $rootScope, $logger) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('FilesController');

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    FilesController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('FilesController', ['$scope', '$rootScope', '$logger', FilesController]);
})();