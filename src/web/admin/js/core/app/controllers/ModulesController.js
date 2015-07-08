﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ModulesController', ['$scope', '$location', '$q', '$logger', '$jsnbt', 'AuthService', function ($scope, $location, $q, $logger, $jsnbt, AuthService) {
            
            var logger = $logger.create('ModulesController');

            $scope.data = {};
            

            var fn = {

                load: function () {
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
                }

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


            fn.load().then(function (response) {
                $scope.data = response;
            }, function (ex) {
                logger.error(ex);
            });

        }]);
})(); 