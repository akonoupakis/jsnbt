;(function () {
    "use strict";

    var PromptController = function ($scope, $rootScope, $logger, MODAL_EVENTS) {
        jsnbt.controllers.PromptModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('PromptController');

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    PromptController.prototype = Object.create(jsnbt.controllers.PromptModalControllerBase.prototype);

    angular.module("jsnbt")
        .controller('PromptController', ['$scope', '$rootScope', '$logger', 'MODAL_EVENTS', PromptController]);
})();