/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.FormModalControllerBase = (function (FormModalControllerBase) {

                FormModalControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    $scope.$on(CONTROL_EVENTS.valueChanged, function (sender, value) {
                        sender.stopPropagation();
                        $scope.ngModel = value;
                    });

                    $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                        self.validate();

                        if (self.isValid()) {
                            self.publish().then(function (response) {
                                $scope.$emit(MODAL_EVENTS.valueSubmitted, response);
                            }).catch(function (ex) {
                                throw ex;
                            });
                        }
                    });
                };
                FormModalControllerBase.prototype = Object.create(controllers.FormControllerBase.prototype);

                FormModalControllerBase.prototype.publish = function () {
                    var deferred = this.ctor.$q.defer();

                    deferred.resolve(null);

                    return deferred;
                };

                return FormModalControllerBase;

            })(controllers.FormModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();