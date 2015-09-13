/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('FunctionService', ['$q', 'ModalService', function ($q, ModalService) {
            var FunctionService = {};
            
            FunctionService = {

                selectNode: function (domain, selected, options) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'select a content node',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/core/modals/nodeSelector.html',
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
                        title: 'select the content nodes you want',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/core/modals/nodeSelector.html',
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
        }]);
})();