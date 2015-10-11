/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('ModalService', ['$q', '$modal', 'MODAL_EVENTS', function ($q, $modal, MODAL_EVENTS) {
            var ModalService = {};
            
            ModalService.open = function (scope) {
                var deferred = $q.defer();

                var modalCtrl = function ($scope, $modalInstance) {
                    angular.extend($scope, scope);
                    
                    $scope.modal = {
                        title: scope.title,
                        template: scope.template                        
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
                    template: '<div ng-controller="' + scope.controller + '" ng-include="\'tmpl/core/common/modal-content.html\'"></div>',
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
            
            return ModalService;
        }]);
})();