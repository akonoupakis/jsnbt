/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ListSelectorModalControllerBase = (function (ListSelectorModalControllerBase) {

                ListSelectorModalControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                };
                ListSelectorModalControllerBase.prototype = Object.create(controllers.ListControllerBase.prototype);

                return ListSelectorModalControllerBase;

            })(controllers.ListSelectorModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();