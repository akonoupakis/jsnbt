/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt-addon-blog", [])
        .controller('BlogController', function ($scope) {
            $scope.blog = $scope.blog || {};
            $scope.blog.title = 'blog title';


            console.log('works!');
        });
})();