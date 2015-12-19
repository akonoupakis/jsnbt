;(function () {
    "use strict";

    var DeletePromptController = function ($scope, $rootScope, $logger, MODAL_EVENTS) {
        jsnbt.controllers.ConfirmModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('DeletePromptController');

        $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
            $scope.$emit(MODAL_EVENTS.valueSubmitted, true);
        });

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    DeletePromptController.prototype = Object.create(jsnbt.controllers.ConfirmModalControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DeletePromptController', ['$scope', '$rootScope', '$logger', 'MODAL_EVENTS', DeletePromptController]);
})();