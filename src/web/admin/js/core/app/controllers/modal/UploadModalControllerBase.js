/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.UploadModalControllerBase = (function (UploadModalControllerBase) {

                UploadModalControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));
                };
                UploadModalControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);

                UploadModalControllerBase.prototype.requested = function () {
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, true);
                };

                return UploadModalControllerBase;

            })(controllers.UploadModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();