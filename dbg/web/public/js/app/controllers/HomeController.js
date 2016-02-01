/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('HomeController', ['$scope', '$q', '$jsnbt', '$context', '$data', '$text', '$url', '$image',
            function ($scope, $q, $jsnbt, $context, $data, $text, $url, $image) {

                $scope.init().then(function () {
                    //var built = $image.build($scope.layout.image.image.src, $scope.layout.image.image.gen);
                    //console.log('initited', $scope.layout, built);
                });

            }]);


})();