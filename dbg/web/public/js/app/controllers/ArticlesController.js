/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ArticlesController', function ($scope, $data, $url) {

            $scope.articles = [];
            console.log('articlesController');

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
                    domain: 'news',
                    entity: 'article',
                    'active.en': true
                }).then(function (data) {
                    $scope.articles = _.map(data, function (x) { 
                        var c = $scope.flat(x);
                        c.url = $url.build($scope.language, x, pointerResult);
                  //      console.log(12, c.url, x, x.url);
                        return c;
                    });
                    //console.log(data);
                }, function (ex) {
                    throw ex;
                })

            }, function (ex) {
                throw ex;
            })

        });
})();