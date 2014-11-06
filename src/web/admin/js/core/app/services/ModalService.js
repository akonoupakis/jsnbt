/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('ModalService', function ($q, $modal, MODAL_EVENTS) {
            var ModalService = {};
            
            ModalService.open = function (scope) {
                var deferred = $q.defer();

                var modalTmplInternal = 'tmpl/core/partial/modal/nodeSelector.html';
                var modalDomain = 'core';

                var modalCtrl = function ($scope, $modalInstance) {
                    angular.extend($scope, scope);
                    
                    $scope.valid = false;

                    $scope.$on(MODAL_EVENTS.valueSubmitted, function (sender, value) {
                        sender.stopPropagation();

                        $scope.selected = value;

                        if ($scope.selected !== undefined && $scope.selected !== '')
                            $modalInstance.close($scope.selected);
                    });

                    $scope.ok = function () {
                        $scope.$broadcast(MODAL_EVENTS.valueRequested);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                };

                var modalInstance = $modal.open({
                    template: '<div ng-controller="' + scope.controller + '" ng-include="\'tmpl/core/partial/common/modal-content.html\'"></div>',
                    backdrop: true,
                    controller: modalCtrl,
                    size: 'lg'
                });

                modalInstance.result.then(function (selectedItem) {
                    deferred.resolve(selectedItem);
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            return ModalService;
        });
})();