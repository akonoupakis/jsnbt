/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AppController', function ($scope) {

            $scope.user = null;

            $scope.pageId = $('head > meta[name="page"]').prop('content');
            $scope.pointerId = $('head > meta[name="pointer"]').prop('content');

            $scope.language = $('html').prop('lang');

            $scope.page = null;
            $scope.pageData = null
            $scope.pointer = null;
            $scope.pointerData = null
            
            $scope.localizedUrls = {};
            
            $scope.flat = function (node) {
                var newObj = {};
                node = node || {};
                if (node.data && node.data.localized && node.data.localized[$scope.language])
                    $.extend(true, newObj, node.data.localized[$scope.language]);

                if (node.data && node.data.localized)
                    delete node.data.localized;

                if (node.data)
                    $.extend(true, newObj, node.data);

                return newObj;
            }

            if ($scope.pageId) {
                dpd.nodes.get($scope.pageId, function (result, error) {
                    if (error) {
                        throw error;
                    }
                    else {
                        $scope.page = result;
                        $scope.pageData = $scope.flat(result);
                        console.log('page', $scope.pageId, $scope.page, $scope.pageData);
                        $scope.$apply();
                    }
                });

            }

            if ($scope.pointerId) {
                dpd.nodes.get($scope.pointerId, function (result, error) {
                    if (error) {
                        throw error;
                    }
                    else {
                        $scope.pointer = result;
                        $scope.pointerData = $scope.flat(result);
                        console.log('pointer', $scope.pointerId, $scope.pointer, $scope.pointerData);
                        $scope.$apply();
                    }
                });
            }

        });
})();