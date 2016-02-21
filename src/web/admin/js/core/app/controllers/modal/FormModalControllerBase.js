/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.FormModalControllerBase = (function (FormModalControllerBase) {

                FormModalControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    var logger = $logger.create('FormModalControllerBase');

                    $scope.breadcrumb = false;

                    $scope.$on(CONTROL_EVENTS.valueChanged, function (sender, value) {
                        sender.stopPropagation();
                        $scope.ngModel = value;
                    });

                    $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                        self.run('validating').then(function () {
                            self.validate().then(function (validationResults) {
                                self.run('validated', [validationResults]).then(function () {
                                    if (validationResults) {
                                        var model = self.get();
                                        self.run('publishing', [model]).then(function () {
                                            self.publish(model).then(function (pushed) {
                                                if (pushed) {
                                                    $scope.$emit(MODAL_EVENTS.valueSubmitted, pushed);
                                                }
                                                else {
                                                    self.failed(new Error('save unsuccessful'));
                                                }
                                            }).catch(function (ex) {
                                                self.failed(ex);
                                            });
                                        }).catch(function (publishingError) {
                                            logger.error(publishingError);
                                        });
                                    }
                                }).catch(function (validatedError) {
                                    logger.error(validatedError);
                                });
                            }).catch(function (validateError) {
                                logger.error(validateError);
                            });

                        }).catch(function (validatingError) {
                            logger.error(validatingError);
                        });
                    });
                };
                FormModalControllerBase.prototype = Object.create(controllers.FormControllerBase.prototype);

                FormModalControllerBase.prototype.publish = function () {
                    var deferred = this.ctor.$q.defer();

                    deferred.resolve(null);

                    return deferred.promise;
                };
                
                return FormModalControllerBase;

            })(controllers.FormModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();