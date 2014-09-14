/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TestController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, TreeNodeService) {
            
            //$scope.nodes1 = [];

            $scope.domain = 'core';
            TreeNodeService.getNodes({
                identifier: 'content:nodes',
                domain: $scope.domain,
                parentId: '',
                parentIds: []
            }).then(function (response) {
                $scope.nodes1 = [];// response;
            }, function (error) {
                throw error;
            });

            //$scope.domain = 'core';
            //TreeNodeService.getNodes({
            //    identifier: 'content:nodes',
            //    domain: $scope.domain,
            //    parentId: '',
            //    parentIds: []
            //}).then(function (response) {
            //    $scope.nodes2 = response;
            //}, function (error) {
            //    throw error;
            //});

            $scope.fn = {
                canCreate: function (item) {
                    return true;
                },
                create: function (item) {
                    console.log('create', item.id, item.name);
                },
                canEdit: function (item) {
                    return true;
                },
                edit: function (item) {
                    console.log('edit', item.id, item.name);
                },
                canDelete: function (item) {
                    return true;
                },
                delete: function (item) {
                    console.log('delete', item.id, item.name);
                },
                canPublish: function (item) {
                    return true;
                },
                publish: function (item) {
                    console.log('publish', item.id, item.name);
                },
                canOpen: function (item) {
                    return true;
                },
                open: function (item) {
                    console.log('open', item.id, item.name);
                }
            };

            $scope.createNow = function (item) {
                console.log('create', item.id, item.name);
            };
        });
})();