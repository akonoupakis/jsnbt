/* global angular:false */

(function () {
    "use strict";

    var DeniedController = function ($scope, $rootScope, $logger) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));
        
        var logger = $logger.create('DeniedController');
    };
    DeniedController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);
    
    angular.module("jsnbt")
        .controller('DeniedController', ['$scope', '$rootScope', '$logger', DeniedController]);
})(); 