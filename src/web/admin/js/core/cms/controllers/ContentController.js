/* global angular:false */

(function () {
    "use strict";

    var ContentController = function ($scope, $rootScope, $jsnbt, $location, $logger) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('ContentController');

        $scope.items = [];
               
        
        this.init().then(function () {

            $scope.items = $jsnbt.content;

            if (!$scope.application.localization.enabled) {
                $scope.items = _.filter($jsnbt.content, function (x) {
                    return x.id !== 'languages';
                });
            }

        }).catch(function (ex) {
            logger.error(ex);
        });
    };
    ContentController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('ContentController', ['$scope', '$rootScope', '$jsnbt', '$location', '$logger', ContentController]);
})();