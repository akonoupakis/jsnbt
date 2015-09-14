;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FileUploadController', ['$scope', 'MODAL_EVENTS', function ($scope, MODAL_EVENTS) {

            if (!$scope.path)
                throw new Error('$scope.path not defined in FileUploadController');
            
            $scope.errors = [];
            $scope.validate = function (file) {
                if (file.size > 1000000) {
                    $scope.errors.push({
                        file: file,
                        error: "file is too big",
                        delete: function () {
                            var errorFileName = this.file;
                            $scope.errors = _.filter($scope.errors, function (x) { return x.file !== errorFileName; });
                        }
                    });
                    return false;
                }
                return true;
            }

            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                $scope.$emit(MODAL_EVENTS.valueSubmitted, true);
            });

        }]);
})();