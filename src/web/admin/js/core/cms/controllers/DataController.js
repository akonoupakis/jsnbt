/* global angular:false */

(function () {
    "use strict";

    var DataController = function ($scope, $rootScope, $logger, $location, $jsnbt, $q) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('DataController');

        $scope.load = function () {
            var deferred = $q.defer();

            var data = data = {
                items: _.sortBy(_.filter($jsnbt.lists, function (x) { return x.domain === 'public'; }), 'name')
            };

            deferred.resolve(data);
            
            return deferred.promise;
        };

        $scope.gridFn = {

            open: function (item) {
                $location.next('/content/data/' + item.id);
            }

        };

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    DataController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DataController', ['$scope', '$rootScope', '$logger', '$location', '$jsnbt', '$q', DataController]);
})();