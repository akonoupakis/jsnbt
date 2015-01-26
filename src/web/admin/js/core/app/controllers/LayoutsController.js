﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LayoutsController', function ($scope, $logger, $location, $jsnbt) {
            
            var logger = $logger.create('LayoutsController');
            
            $scope.data = {};

            var layouts = [];
            $($jsnbt.layouts).each(function (l, layout) {
                layouts.push({
                    id: layout.id,
                    name: layout.name
                });
            });
            $scope.data = {
                items: _.sortBy(layouts, 'name')
            };

            $scope.gridFn = {

                edit: function (item) {
                    $location.next('/content/layouts/' + item.id);
                }

            };

        });
})();