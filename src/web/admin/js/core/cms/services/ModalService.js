﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('ModalService', ['$q', '$modal', 'MODAL_EVENTS', function ($q, $modal, MODAL_EVENTS) {
            var ModalService = {};
            
            ModalService.open = function (options) {
                var deferred = $q.defer();

                var modalCtrl = function ($scope, $modalInstance) {
                    angular.extend($scope, options.scope);
                    
                    $scope.modal = {
                        title: options.title,
                        template: options.template
                    };
                    
                    if ($scope.btn) {
                        if ($scope.btn.cancel === undefined)
                            $scope.btn.cancel = 'cancel';

                        if ($scope.btn.ok === undefined)
                            $scope.btn.ok = 'done';
                    }
                    else {
                        $scope.btn = {
                            cancel: 'cancel',
                            ok: 'done'
                        };
                    }

                    $scope.defaults = $scope.$$prevSibling.defaults;

                    $scope.valid = false;
                    
                    $scope.$on(MODAL_EVENTS.valueSubmitted, function (sender, value) {
                        sender.stopPropagation();

                        $scope.selected = value;

                        if (value !== undefined && value !== '') {
                            $modalInstance.close(value);
                        }
                    });

                    $scope.ok = function () {
                        $scope.$broadcast(MODAL_EVENTS.valueRequested);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                };

                var modalInstance = $modal.open({
                    template: '<div ng-controller="' + options.controller + '" ng-include="\'tmpl/core/common/modal-content.html\'"></div>',
                    backdrop: true,
                    controller: modalCtrl,
                    size: 'lg'
                });

                modalInstance.result.then(function (selectedItem) {
                    deferred.resolve(selectedItem);
                }, function (ex) {
                    deferred.reject();
                });

                return deferred.promise;
            };
            
            var defaultOptions = {
                title: undefined,
                controller: undefined,
                template: undefined,
                scope: {

                }
            };

            var createOptionMethods = function (type) {
                
                var options = {};
                $.extend(true, options, defaultOptions, {
                    scope: {

                    }
                });

                var optionMethods = {};

                optionMethods.title = function (title) {
                    options.title = title;
                };

                optionMethods.controller = function (controller) {
                    options.controller = controller;
                };

                optionMethods.template = function (template) {
                    options.template = template;
                };

                optionMethods.scope = function (scope) {
                    $.extend(true, options.scope, scope);
                };

                if (type === 'confirm' || type === 'prompt') {
                    optionMethods.message = function (message) {
                        console.log(12, message);
                        $.extend(true, options.scope, {
                            message: message
                        });
                    };
                }

                optionMethods.get = function () {
                    return options;
                };

                return optionMethods;

            };

            ModalService.confirm = function (opts) {
                var deferred = $q.defer();

                var optionMethods = createOptionMethods('confirm');
                optionMethods.title('are you sure?');
                optionMethods.controller('ConfirmController');
                optionMethods.template('tmpl/core/base/modals/confirm.html');
                optionMethods.message('this action cannot be undone<br />please think twice and confirm to continue');
                
                if (typeof (opts) === 'function')
                    opts(optionMethods);

                var options = optionMethods.get();

                this.open(options).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            }

            ModalService.prompt = function (opts) {
                var deferred = $q.defer();

                var optionMethods = createOptionMethods('prompt');
                optionMethods.title('oops');
                optionMethods.controller('PromptController');
                optionMethods.template('tmpl/core/base/modals/prompt.html');
                optionMethods.message('this action cannot be continued');
                optionMethods.scope({
                    btn: {
                        ok: 'cool',
                        cancel: false
                    }
                });

                if (typeof (opts) === 'function')
                    opts(optionMethods);
                
                var options = optionMethods.get();
                
                this.open(options).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            }

            return ModalService;
        }]);
})();