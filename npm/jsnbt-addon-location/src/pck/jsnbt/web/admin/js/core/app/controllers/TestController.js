﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TestController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, TreeNodeService, $data, AuthService) {
          
            $scope.logout = function () {
                AuthService.logout();
            };

            var userId = 1;
            $scope.click = function () {
                
                //$data.users.post({
                //    username: 'test' + userId + '@test.com',
                //    password: 'asdasd',
                //    firstName: 'Alpha',
                //    lastName: 'Vita',
                //    roles: ['public']
                //}).then(function (results) {
                //    console.log('result', results);
                //    userId++;
                //}, function (error) {
                //    console.log('error', error);
                //    userId++;
                //});

                $data.nodes.post($data.create('nodes', {
                    name: 'test',
                    entity: 'product-category',
                    domain: 'eshop',
                    parent: '',

                }));

            };
          
        });
})();