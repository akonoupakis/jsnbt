/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ModulesController', function ($scope, $location, $q, $logger, $jsnbt) {
            
            var logger = $logger.create('ModulesController');

            $scope.data = {};
            

            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    var modules = [];
                    $($jsnbt.modules).each(function (i, item) {
                        var module = {};
                        $.extend(true, module, item);
                        modules.push(module);
                    });
                    var data = {
                        items: modules,
                        more: function () { }
                    };

                    deferred.resolve(data);

                    return deferred.promise;
                }

            };


            $scope.gridFn = {

                edit: function (module) {
                    $location.next('/modules/' + module.domain);
                }

            };


            fn.load().then(function (response) {
                $scope.data = response;
            }, function (ex) {
                logger.error(ex);
            });

        });
})(); 