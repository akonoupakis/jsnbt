﻿/* global angular:false */

(function () {
    "use strict";

    var ModulesController = function ($scope, $rootScope, $location, $q, $logger, $jsnbt, AuthService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('ModulesController');
        
        $scope.load = function () {
            var deferred = $q.defer();

            var modules = [];
            for (var moduleName in $jsnbt.modules) {
                if ($jsnbt.modules[moduleName].browsable) {
                    var module = {};
                    $.extend(true, module, $jsnbt.modules[moduleName]);
                    modules.push(module);
                }
            }
            var data = {
                items: modules,
                more: function () { }
            };

            deferred.resolve(data);

            return deferred.promise;
        };

        $scope.gridFn = {

            canOpen: function (module) {
                if (module.section) {
                    return AuthService.authorize($scope.current.user, module.section);
                }
                else {
                    return true;
                }
            },

            open: function (module) {
                $location.next('/modules/' + module.domain);
            }

        };


        $scope.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    ModulesController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('ModulesController', ['$scope', '$rootScope', '$location', '$q', '$logger', '$jsnbt', 'AuthService', ModulesController]);
})(); 