/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FilesController', function ($scope, $location) {

            $scope.back = function () {
                $location.previous('/content');
            };

        });
})();