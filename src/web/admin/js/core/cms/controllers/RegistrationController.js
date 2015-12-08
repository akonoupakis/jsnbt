/* global angular:false */

(function () {
    "use strict";

    var RegistrationController = function ($scope, $rootScope, $logger) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));
        
        var logger = $logger.create('RegistrationController');
    };
    RegistrationController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);
    
    angular.module("jsnbt")
        .controller('RegistrationController', ['$scope', '$rootScope', '$logger', RegistrationController]);
})(); 