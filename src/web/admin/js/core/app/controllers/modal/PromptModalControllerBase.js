/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.PromptModalControllerBase = (function (PromptModalControllerBase) {

                PromptModalControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));
                };
                PromptModalControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);
                
                PromptModalControllerBase.prototype.requested = function () {
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, true);
                };

                return PromptModalControllerBase;

            })(controllers.PromptModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();