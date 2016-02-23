/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.UploadModalControllerBase = (function (UploadModalControllerBase) {

                UploadModalControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    $scope.breadcrumb = false;

                    $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                        $scope.$emit(MODAL_EVENTS.valueSubmitted, true);
                    });

                };
                UploadModalControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);
                
                return UploadModalControllerBase;

            })(controllers.UploadModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();