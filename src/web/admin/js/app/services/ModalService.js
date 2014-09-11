/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('ModalService', function ($q, $modal) {
            var ModalService = {};
            
            ModalService.open = function (scope) {
                var deferred = $q.defer();

                var modalTmplInternal = 'tmpl/partial/modal/nodeSelector.html';
                var modalDomain = 'core';

                var modalCtrl = function ($scope, $modalInstance) {
                    angular.extend($scope, scope);
                    
                    $scope.$on('selected', function (sender, value) {
                        sender.stopPropagation();

                        $scope.selected = value;
                    });

                    $scope.ok = function () {
                        $scope.$broadcast('select');

                        if ($scope.selected !== undefined && $scope.selected !== '')
                            $modalInstance.close($scope.selected);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                };

                var modalInstance = $modal.open({
                    templateUrl: 'tmpl/partial/common/modal-content.html',
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