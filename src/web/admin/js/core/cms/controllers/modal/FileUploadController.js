;(function () {
    "use strict";

    var FileUploadController = function ($scope, $rootScope, $logger, MODAL_EVENTS) {
        jsnbt.controllers.UploadModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('FileUploadController');

        if (!$scope.modal.path)
            throw new Error('$scope.modal.path not defined in FileUploadController');

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

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    FileUploadController.prototype = Object.create(jsnbt.controllers.UploadModalControllerBase.prototype);

    angular.module("jsnbt")
        .controller('FileUploadController', ['$scope', '$rootScope', '$logger', 'MODAL_EVENTS', FileUploadController]);
})();