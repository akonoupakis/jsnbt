﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('FunctionService', function ($q, $data, ModalService) {
            var FunctionService = {};
            
            FunctionService = {

                getEditUrl: function (node) {
                    return '/content/nodes/' + node.id;
                },

                getViewUrl: function (node) {
                    return '';
                },

                getBackUrl: function (node) {
                    return '/content/nodes';
                },

                selectNode: function (domain, selected, options) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'Select a content node',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/core/partial/modal/nodeSelector.html',
                        domain: domain,
                        mode: 'single',
                        options: options
                    }).then(function (result) {
                        deferred.resolve(result);
                    });

                    return deferred.promise;
                },

                selectNodes: function (domain, selected, options) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'Select the content nodes you want',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/core/partial/modal/nodeSelector.html',
                        domain: domain,
                        mode: 'multiple',
                        options: options
                    }).then(function (results) {
                        deferred.resolve(results);
                    });

                    return deferred.promise;
                }

            };

            return FunctionService;
        });
})();