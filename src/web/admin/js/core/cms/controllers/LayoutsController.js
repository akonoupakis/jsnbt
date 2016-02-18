/* global angular:false */

(function () {
    "use strict";

    var LayoutsController = function ($scope, $rootScope, $jsnbt, $logger, $q) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('LayoutsController');
                
        $scope.gridFn = {

            edit: function (item) {
                $scope.route.next('/content/layouts/' + item.id);
            }

        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    LayoutsController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    LayoutsController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        var layouts = [];
        for (var layoutName in this.ctor.$jsnbt.layouts) {
            var layout = this.ctor.$jsnbt.layouts[layoutName];

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

    angular.module("jsnbt")
        .controller('LayoutsController', ['$scope', '$rootScope', '$jsnbt', '$logger', '$q', LayoutsController]);
})();