/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ListBaseController', ['$scope', function ($scope) {
           
            $scope.data = {};
          
            $scope.set = function (data) {
                $scope.data = data;
            };

            $scope.remove = function (itemId) {
                $scope.data.items = _.filter($scope.data.items, function (x) { return x.id !== itemId; });
            };

        }]);
})();