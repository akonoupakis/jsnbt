;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FileUploadController', ['$scope', 'MODAL_EVENTS', function ($scope, MODAL_EVENTS) {

            if (!$scope.path)
                throw new Error('$scope.path not defined in FileUploadController');
            
            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                $scope.$emit(MODAL_EVENTS.valueSubmitted, true);
            });

        }]);
})();