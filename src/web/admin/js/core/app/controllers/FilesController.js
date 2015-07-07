/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FilesController', ['$scope', '$location', function ($scope, $location) {

            $scope.back = function () {
                $location.previous('/content');
            };

        }]);
})();