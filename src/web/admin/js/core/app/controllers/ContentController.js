/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ContentController', ['$scope', '$jsnbt', '$location', function ($scope, $jsnbt, $location) {

            $scope.items = $jsnbt.content;
                        
        }]);
})();