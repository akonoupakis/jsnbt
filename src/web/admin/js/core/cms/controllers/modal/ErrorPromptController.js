;(function () {
    "use strict";

    var ErrorPromptController = function ($scope, $rootScope, $logger, MODAL_EVENTS) {
        jsnbt.controllers.PromptModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('ErrorPromptController');

        $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
            $scope.$emit(MODAL_EVENTS.valueSubmitted, true);
        });

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    ErrorPromptController.prototype = Object.create(jsnbt.controllers.PromptModalControllerBase.prototype);


    angular.module("jsnbt")
        .controller('ErrorPromptController', ['$scope', '$rootScope', '$logger', 'MODAL_EVENTS', ErrorPromptController]);
})();