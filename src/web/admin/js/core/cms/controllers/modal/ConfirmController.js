;(function () {
    "use strict";

    var ConfirmController = function ($scope, $rootScope, $logger, MODAL_EVENTS) {
        jsnbt.controllers.ConfirmModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('ConfirmController');

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    ConfirmController.prototype = Object.create(jsnbt.controllers.ConfirmModalControllerBase.prototype);

    angular.module("jsnbt")
        .controller('ConfirmController', ['$scope', '$rootScope', '$logger', 'MODAL_EVENTS', ConfirmController]);
})();