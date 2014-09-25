/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('FunctionService', function ($q, $data, ModalService) {
            var FunctionService = {};

            FunctionService.tree = {

                canCreate: function (node) {
                    if (node.entity === 'link' || node.entity === 'pointer')
                        return false;

                    return true;
                },

                create: function (node) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'Type a name',
                        controller: 'NamePromptController',
                        template: 'tmpl/partial/modal/namePrompt.html'
                    }).then(function (result) {
                        if (!!result && result !== '') {
                            $data.nodes.post($data.create('nodes', {
                                domain: (node || {}).domain || 'core',
                                name: result,
                                entity: 'page',
                                parent: (node || {}).id || '',
                            })).then(function (nodeResult) {
                                deferred.resolve(nodeResult);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                },

                canDelete: function (node) {
                    if (node.locked || (node.entity !== 'pointer' && node.childCount !== 0))
                        return false;

                    return true;
                },

                delete: function (node) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'Are you sure you want to permanently delete the node ' + node.name + '?',
                        controller: 'DeletePromptController',
                        template: 'tmpl/partial/modal/deletePrompt.html'
                    }).then(function (result) {
                        if (result) {
                            $data.nodes.del(node.id).then(function (nodeDeleteResults) {
                                deferred.resolve(true);
                            }, function (nodeDeleteError) {
                                deferred.reject(nodeDeleteError);
                            });
                        }
                    });

                    return deferred.promise;
                }

            };

            FunctionService.url = {

                getEditUrl: function (node) {
                    return '/content/nodes/' + node.id;
                },

                getViewUrl: function (node) {
                    return '';
                },

                getBackUrl: function (node) {
                    return '/content/nodes';
                }

            };

            FunctionService.node = {

                select: function (selected, options) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'Select a content node',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/partial/modal/nodeSelector.html',
                        domain: 'core',
                        mode: 'single',
                        options: options
                    }).then(function (result) {
                        deferred.resolve(result);
                    });

                    return deferred.promise;
                },

                selectMany: function (selected, options) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'Select the content nodes you want',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/partial/modal/nodeSelector.html',
                        domain: 'core',
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