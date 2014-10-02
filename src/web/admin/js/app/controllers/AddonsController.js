/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AddonsController', function ($scope, $location, $q, $logger) {
            
            var logger = $logger.create('AddonsController');

            $scope.data = {};
            

            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    var addons = [];
                    $(jsnbt.addons).each(function (i, item) {
                        var addon = {};
                        $.extend(true, addon, item);
                        addons.push(addon);
                    });
                    var data = {
                        items: addons,
                        more: function () { }
                    };

                    deferred.resolve(data);

                    return deferred.promise;
                }

            };


            $scope.gridFn = {

                edit: function (addon) {
                    $location.next('/addons/' + addon.domain);
                }

            };


            fn.load().then(function (response) {
                $scope.data = response;
            }, function (ex) {
                logger.error(ex);
            });

        });
})(); 