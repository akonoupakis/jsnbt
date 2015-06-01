/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ContentController', function ($scope, $jsnbt, $location) {

            $scope.goto = function (name) {
                $location.next('/content/' + name);
            };
            
            var injects = [];
            _.each($jsnbt.injects, function (inject) {
                if (inject.content)
                    injects.push(inject.content);
            });
            $scope.injects = injects;

        });
})();