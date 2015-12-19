/* global angular:false */

(function () {
    "use strict";

    var NotFoundController = function ($scope, $rootScope, $logger) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));
        
        var logger = $logger.create('NotFoundController');

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    NotFoundController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);
    
    angular.module("jsnbt")
        .controller('NotFoundController', ['$scope', '$rootScope', '$logger', NotFoundController]);
})(); 