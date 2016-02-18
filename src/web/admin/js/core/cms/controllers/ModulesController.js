/* global angular:false */

(function () {
    "use strict";

    var ModulesController = function ($scope, $rootScope, $q, $logger, $jsnbt, AuthService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('ModulesController');

        $scope.gridFn = {

            canOpen: function (module) {
                if (module.section) {
                    return AuthService.isAuthorized($scope.current.user, module.section);
                }
                else {
                    return true;
                }
            },

            open: function (module) {
                $scope.route.next('/modules/' + module.domain);
            }

        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    ModulesController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    ModulesController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        var modules = [];
        for (var moduleName in this.ctor.$jsnbt.modules) {
            if (this.ctor.$jsnbt.modules[moduleName].browsable) {
                var module = {};
                $.extend(true, module, this.ctor.$jsnbt.modules[moduleName]);
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

    angular.module("jsnbt")
        .controller('ModulesController', ['$scope', '$rootScope', '$q', '$logger', '$jsnbt', 'AuthService', ModulesController]);
})(); 