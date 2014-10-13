﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AppController', function ($scope, $http, DpdService) {

            $scope.user = null;
            $scope.language = null;
            $scope.page = null;
            
            $scope.localizedUrls = {};
            
            if ($('head > meta[name="page"]').length > 0) {
                dpd.nodeurls.get({
                    nodeId: $('head > meta[name="page"]').prop('content'),
                    language: $('html').prop('lang')
                }, function (results, error) {
                    console.log('page', $('head > meta[name="page"]').prop('content'), _.first(results));
                });

            }

            if ($('head > meta[name="pointer"]').length > 0) {
                dpd.nodeurls.get({
                    nodeId: $('head > meta[name="pointer"]').prop('content'),
                    language: $('html').prop('lang')
                }, function (results, error) {
                    console.log('pointer', $('head > meta[name="pointer"]').prop('content'), _.first(results));
                });
            }

        });
})();