/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AppController', function ($scope, DpdService, UserService, TextService, LanguageService, NodeService, Cache, Session) {




            $scope.user = null;
            $scope.language = null;
            $scope.page = null;
            
            $scope.localizedUrls = {};

            //UserService.getCurrent().then(function (result) {
            //    $scope.user = result;
            //}, function (error) {
            //    throw error;
            //});

            LanguageService.getCurrent().then(function (result) {
                $scope.language = result;
                console.log('current language', result);
            }, function (error) {
                throw error;
            });

            NodeService.getCurrent().then(function (result) {
                $scope.page = result;
                console.log('current node by url', result);
            }, function (error) {
                throw error;
            }).then(function () {
                //console.log($scope.page);
                if ($scope.page) {
                    NodeService.getById($scope.page.id).then(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            $scope.localizedUrls[results[i].language] = results[i].fullUrl;
                        }
                        console.log($scope.localizedUrls);
                    }, function (error2) {
                        throw error2;
                    }).then(function () {
                        //NodeService.getByCode($scope.page.domain, $scope.page.code).then(function (result3) {
                        //    console.log('current nodes by code', result3);
                        //}, function (error3) {
                        //    throw error3;
                        //}).then(function () {
                        //    console.log('completed!');
                        //});
                    });
                } 
            });



            //TextService.get('textKey').then(function (result) {
            //    $scope.key = result;
            //    //console.log(result);
            //}, function (error) {

            //});

            //Cache.get('domain', 'key').then(function (result) {
            //    console.log('d', result);
            //});

            //Session.getLanguage().then(function (result) {
            //    console.log('lan', result);
            //});

        });
})();