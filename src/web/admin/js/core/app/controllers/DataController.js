/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DataController', ['$scope', '$rootScope', '$location', '$jsnbt', function ($scope, $rootScope, $location, $jsnbt) {
           
            $scope.data = {};
            
            $scope.back = function () {
                if ($rootScope.location.previous) {
                    $location.previous($rootScope.location.previous);
                }
                else {
                    $location.previous('/content');
                }
            };

            $scope.data = {
                items: _.sortBy(_.filter($jsnbt.lists, function (x) { return x.domain === 'public'; }), 'name')
            };
            
            $scope.gridFn = {

                edit: function (item) {
                    $location.next('/content/data/' + item.domain + '/' + item.id);
                }

            };

        }]);
})();