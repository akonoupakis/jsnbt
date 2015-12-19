/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('ModalService', ['$rootScope', '$q', '$modal', 'MODAL_EVENTS', function ($rootScope, $q, $modal, MODAL_EVENTS) {
            var ModalService = {};
            
            var openModal = function (options) {
                var deferred = $q.defer();

                var modalCtrl = function ($scope, $modalInstance) {
                    angular.extend($scope, options.scope);

                    this.parentController = $rootScope.controller;

                    var me = this;

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

                    $scope.defaults = $rootScope.defaults;

                    $scope.valid = false;
                    
                    $scope.$on(MODAL_EVENTS.valueSubmitted, function (sender, value) {
                        sender.stopPropagation();

                        $scope.selected = value;

                        if (value !== undefined && value !== '') {
                            $rootScope.controller = me.parentController;
                            $modalInstance.close(value);
                        }
                    });

                    $scope.ok = function () {
                        $scope.$broadcast(MODAL_EVENTS.valueRequested);
                    };

                    $scope.cancel = function () {
                        $rootScope.controller = me.parentController;
                        $modalInstance.dismiss('cancel');
                    };
                };

                var modalInstance = $modal.open({
                    template: '<div ng-controller="' + options.controller + '" ng-include="\'tmpl/core/common/modal.html\'"></div>',
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
                        $.extend(true, options.scope, {
                            message: message
                        });
                    };
                }

                if (type === 'upload') {
                    optionMethods.path = function (path) {
                        $.extend(true, options.scope, {
                            path: path
                        });
                    };
                }

                if (type === 'form') {
                    optionMethods.data = function (data) {
                        $.extend(true, options.scope, {
                            data: data
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
                optionMethods.scope({
                    btn: {
                        ok: 'continue'
                    }
                });

                if (typeof (opts) === 'function')
                    opts(optionMethods);

                var options = optionMethods.get();

                openModal(options).then(function (result) {
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
                
                openModal(options).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            }

            ModalService.select = function (opts) {
                var deferred = $q.defer();

                var optionMethods = createOptionMethods('select');
                optionMethods.title('select');

                if (typeof (opts) === 'function')
                    opts(optionMethods);

                var options = optionMethods.get();
                openModal(options).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            }

            ModalService.upload = function (opts) {
                var deferred = $q.defer();

                var optionMethods = createOptionMethods('upload');
                optionMethods.title('upload');
                optionMethods.controller('FileUploadController');
                optionMethods.template('tmpl/core/base/modals/upload.html');

                if (typeof (opts) === 'function')
                    opts(optionMethods);

                var options = optionMethods.get();

                openModal(options).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            }

            ModalService.form = function (opts) {
                var deferred = $q.defer();

                var optionMethods = createOptionMethods('form');
                
                if (typeof (opts) === 'function')
                    opts(optionMethods);

                var options = optionMethods.get();

                openModal(options).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            }

            ModalService.open = function (opts) {
                var deferred = $q.defer();

                var optionMethods = createOptionMethods();

                if (typeof (opts) === 'function')
                    opts(optionMethods);

                var options = optionMethods.get();

                openModal(options).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (ex) {
                    deferred.reject(ex);
                });

                return deferred.promise;
            }

            return ModalService;
        }]);
})();