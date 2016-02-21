/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.PromptModalControllerBase = (function (PromptModalControllerBase) {

                PromptModalControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    $scope.breadcrumb = false;

                    $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                        $scope.$emit(MODAL_EVENTS.valueSubmitted, true);
                    });

                    $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
                        sender.stopPropagation();
                    });
                };
                PromptModalControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);
                
                return PromptModalControllerBase;

            })(controllers.PromptModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();