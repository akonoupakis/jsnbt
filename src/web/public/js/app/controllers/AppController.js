﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AppController', function ($scope, $http, DpdService, UserService, TextService, LanguageService, NodeService, Cache, Session) {

            $scope.user = null;
            $scope.language = null;
            $scope.page = null;
            
            $scope.localizedUrls = {};

            if ($('head > meta[name="page"]').length > 0) {
                var url = 'jsnbt-api/core/node';
                console.log($('head > meta[name="page"]').prop('content'));
                $http.post(url, {
                    fn: 'get',
                    id: $('head > meta[name="page"]').prop('content'),
                    language: $('html').prop('lang'),
                    preview: $('head > meta[name="draft"]').prop('content') == 'true'
                }).then(function (data) {
                    if (data.status === 200) {
                        console.log('res', data.data.d);
                    } else {
                        console.log('err', data);
                    }
                });

                //$http.post(url, {
                //    fn: 'getPage',
                //    parentId: $('head > meta[name="page"]').prop('content'),
                //    language: $('html').prop('lang'),
                //    preview: $('head > meta[name="draft"]').prop('content') == 'true'
                //}).then(function (data) {
                //    if (data.status === 200) {
                //        console.log('res', data.data.d);
                //    } else {
                //        console.log('err', data);
                //    }
                //});
            }

            //LanguageService.getCurrent().then(function (result) {
            //    $scope.language = result;
            //    console.log('current language', result);
            //}, function (error) {
            //    throw error;
            //});


            //NodeService.getCurrent().then(function (result) {
            //    $scope.page = result;
            //    console.log('current node by url', result);
            //}, function (error) {
            //    throw error;
            //}).then(function () {
            //    if ($scope.page) {
            //        var languages = [];
            //        NodeService.getById($scope.page.id).then(function (results) {
            //            for (var i = 0; i < results.length; i++) {
            //                $scope.localizedUrls[results[i].language] = results[i].fullUrl;
            //                languages.push(results[i].language);
            //            }

            //            $scope.languages = languages;
            //        }, function (error2) {
            //            throw error2;
            //        }).then(function () {
            //            //NodeService.getByCode($scope.page.domain, $scope.page.code).then(function (result3) {
            //            //    console.log('current nodes by code', result3);
            //            //}, function (error3) {
            //            //    throw error3;
            //            //}).then(function () {
            //            //    console.log('completed!');
            //            //});
            //        });
            //    } 
            //});



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