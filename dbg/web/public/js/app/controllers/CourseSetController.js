/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('CourseSetController', function ($scope, $data, $url) {

            $scope.articles = [];
            console.log('courseSetController');

            var pageId = $('head > meta[name="page"]').prop('content');
            var pointerId = $('head > meta[name="pointer"]').prop('content');

            $data.nodes.get({
                id: {
                    $in: [
                        pageId,
                        pointerId
                    ] 
                }
            }).then(function (results) {
                //console.log('re', pageId, pointerId, results);
                var pageResult = _.find(results, function (x) { return x.id === pageId; });
                var pointerResult = _.find(results, function (x) { return x.id === pointerId; });

                $data.nodes.get({
                    hierarchy: pageId,
                    domain: 'courses',
                    entity: 'course',
                    'active.en': true
                }).then(function (data) {
                    
                    $scope.items = _.map(data, function (x) { 
                        var c = $scope.flat(x);
                        c.url = $url.build($scope.language, x, pointerResult);
                        //      console.log(12, c.url, x, x.url);

                        c.title = x.title[$scope.language];
                        return c;

                    });

                    console.log($scope.items);
                }, function (ex) {
                    throw ex;
                })

            }, function (ex) {
                throw ex;
            })

        });
})();