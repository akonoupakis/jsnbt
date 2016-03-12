/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ConfirmModalControllerBase = (function (ConfirmModalControllerBase) {

                ConfirmModalControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));
                };
                ConfirmModalControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);

                ConfirmModalControllerBase.prototype.requested = function () {
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, true);
                };
                
                return ConfirmModalControllerBase;

            })(controllers.ConfirmModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();