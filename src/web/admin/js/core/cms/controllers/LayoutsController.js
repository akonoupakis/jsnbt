/* global angular:false */

(function () {
    "use strict";

    var LayoutsController = function ($scope, $location, $jsnbt, $logger, $q) {
        jsnbt.ListControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('LayoutsController');

        $scope.load = function () {
            var deferred = $q.defer();

            var layouts = [];
            for (var layoutName in $jsnbt.layouts) {
                var layout = $jsnbt.layouts[layoutName];

                layouts.push({
                    id: layout.id,
                    name: layout.name
                });
            };

            var data = {
                items: _.sortBy(layouts, 'name')
            };

            deferred.resolve(data);

            return deferred.promise;
        };
        
        $scope.gridFn = {

            edit: function (item) {
                $location.next('/content/layouts/' + item.id);
            }

        };

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    LayoutsController.prototype = Object.create(jsnbt.ListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('LayoutsController', ['$scope', '$location', '$jsnbt', '$logger', '$q', LayoutsController]);
})();