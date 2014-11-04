/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('BlogController', function ($scope) {

            $scope.children = [];

            $scope.$watch('page', function (value) {
                if (value) {
                    dpd.nodes.get({
                        parent: value.id,
                        domain: value.domain,
                        entity: 'blog-entry',
                        $sort: {
                            createdOn: -1
                        }
                    }, function (response, error) {
                        if (error)
                            throw error;
                        else {

                            $(response).each(function (i, item) { 
                                $scope.children.push(item);
                                console.log(item.data.localized['en'].title, item.link);
                            });
                            //console.log(response);
                            $scope.$apply();
                        }
                    });
                }
            });

        });
})();