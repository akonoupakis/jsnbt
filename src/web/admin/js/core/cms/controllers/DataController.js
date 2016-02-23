/* global angular:false */

(function () {
    "use strict";

    var DataController = function ($scope, $rootScope, $logger, $jsnbt, $q) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('DataController');
        
        $scope.gridFn = {

            open: function (item) {
                $scope.route.next('/content/data/' + item.id);
            }

        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    DataController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    DataController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        var data = data = {
            items: _.sortBy(_.filter(this.ctor.$jsnbt.lists, function (x) { return x.domain === 'public'; }), 'name')
        };

        deferred.resolve(data);

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('DataController', ['$scope', '$rootScope', '$logger', '$jsnbt', '$q', DataController]);
})();