﻿/* global angular:false */

(function () {
    "use strict";

    var LoginController = function ($scope, $rootScope, $logger) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));
        
        var logger = $logger.create('LoginController');

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    LoginController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);
    
    angular.module("jsnbt")
        .controller('LoginController', ['$scope', '$rootScope', '$logger', LoginController]);
})(); 