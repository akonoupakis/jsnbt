/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ConfirmModalControllerBase = (function (ConfirmModalControllerBase) {

                ConfirmModalControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
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
                ConfirmModalControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);

                ConfirmModalControllerBase.prototype.init = function () {
                    var deferred = this.ctor.$q.defer();

                    this.ctor.$rootScope.controller = this;

                    controllers.ControllerBase.prototype.init.apply(this, arguments).then(function () {
                        deferred.resolve();
                    }).catch(function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                };

                return ConfirmModalControllerBase;

            })(controllers.ConfirmModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();