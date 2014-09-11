;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FileUploadController', function ($scope) {

            if (!$scope.path)
                throw new Error('$scope.path not defined in FileUploadController');
            
            $scope.$on('select', function (sender) {
                $scope.$emit('selected', true);
            });

        });
})();