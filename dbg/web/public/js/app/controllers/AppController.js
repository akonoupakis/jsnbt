/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AppController', ['$scope', '$q', '$jsnbt', '$context', '$data', '$text', '$url', '$image',
            function ($scope, $q, $jsnbt, $context, $data, $text, $url, $image) {

                var page = null;
                var pointer = null;

                $scope.language = $context.language;
                $scope.layoutIds = $context.layouts;
                $scope.pageId = $context.pageId;
                $scope.pointerId = $context.pointerId;

                $scope.text = {};

                $scope.node = {
                    page: null,
                    pointer: null
                };

                $scope.nodes = [];

                $scope.hierarchy = [];
                $scope.breadcrumb = [];

                $scope.containers = $jsnbt.containers;

                $scope.layout = {};
                $scope.page = null;
                $scope.pointer = null;

                $scope.pageUrl = null;
                $scope.pointerUrl = null;

                $scope.setTexts = function () {
                    var textKeys = _.filter(arguments, function (x) { return typeof (x) === 'string' });
                    if (textKeys.length > 0) {
                        $text.get($context.language, textKeys).then(function (response) {
                            $.extend(true, $scope.text, response);
                        }, function (error) {
                            throw error;
                        });
                    }
                };

                $scope.flat = function (node) {
                    var newObj = {};
                    node = node || {};
                    if (node.content && node.content.localized && node.content.localized[$scope.language])
                        $.extend(true, newObj, node.content.localized[$scope.language]);

                    if (node.content && node.content.localized)
                        delete node.content.localized;

                    if (node.content)
                        $.extend(true, newObj, node.content);

                    newObj.title = (node.title || {})[$scope.language];

                    return newObj;
                }

                $scope.queue = [];

                var loadLayouts = function () {
                    var deferred = $q.defer();

                    if ($scope.layoutIds && $scope.layoutIds.length > 0) {
                        $data.layouts.get({ layout: { $in: $scope.layoutIds } }).then(function (results) {
                            deferred.resolve(results);
                        }).catch(function (ex) {
                            deferred.reject(ex);
                        });
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                var loadPage = function () {
                    var deferred = $q.defer();

                    $data.nodes.get({
                        id: {
                            $in: [
                                $scope.pageId,
                                $scope.pointerId
                            ]
                        }
                    }).then(function (results) {
                        var pageResult = _.find(results, function (x) { return x.id === $scope.pageId; });
                        var pointerResult = _.find(results, function (x) { return x.id === $scope.pointerId; });

                        deferred.resolve({
                            page: pageResult,
                            pointer: pointerResult
                        });

                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                $scope.load = function (fn) {
                    $scope.queue.push(fn);
                };

                $scope.loadNodes = function (ids) {
                    var deferred = $q.defer();

                    var targetIds = [];
                    if (_.isString(ids)) {
                        targetIds.push(ids);
                    }
                    if (_.isArray(ids)) {
                        _.each(ids, function (x) {
                            targetIds.push(x);
                        });
                    }

                    var filteredIds = _.filter(targetIds, function (x) {
                        return !_.any($scope.nodes, function (y) { return y.id === x; });
                    });

                    if (filteredIds.length > 0) {

                        var getOptions = {
                            id: {
                                $in: filteredIds
                            }
                        };

                        getOptions['active.' + $scope.language] = true;

                        $data.nodes.get(getOptions).then(function (nodes) {

                            _.each(nodes, function (node) {
                                if (!_.any($scope.nodes, function (y) { return y.id === node.id; }))
                                    $scope.nodes.push(node);
                            });

                            deferred.resolve(nodes);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                $scope.link = function (node, pointer) {
                    return $url.build($scope.language, node, pointer || $scope.node.pointer);
                };

                $scope.init = function () {
                    var deferred = $q.defer();
                    $q.all([loadLayouts(), loadPage()]).then(function (results) {
                        var layouts = results[0];
                        var pageObj = results[1];

                        _.each(layouts, function (layout) {
                            $scope.layout[layout.layout] = $scope.flat(layout);
                        });

                        if (pageObj.page) {
                            $scope.node.page = pageObj.page;
                            $scope.page = $scope.flat(pageObj.page);

                            $scope.nodes.push(pageObj.page);
                        }

                        if (pageObj.pointer) {
                            $scope.node.pointer = pageObj.pointer;
                            $scope.pointer = $scope.flat(pageObj.pointer);

                            $scope.nodes.push(pageObj.pointer);
                        }

                        var nodeIds = _.filter($context.hierarchy, function (x) { return x !== undefined; });
                        $scope.loadNodes(nodeIds).then(function () {

                            $q.all(_.map($scope.queue, function (x) { return x(); })).then(function () {
                                deferred.resolve();
                            }).catch(function (error) {
                                deferred.reject(error);
                            });

                            $scope.hierarchy = _.map($context.hierarchy, function (x) {
                                return _.find($scope.nodes, function (y) {
                                    return y.id === x;
                                });
                            });

                            var hierarchyPointer = null;
                            var hierarchyPointerPrevious = false;
                            _.each($scope.hierarchy, function (hNode) {
                                if (hNode.entity === 'pointer') {
                                    hierarchyPointer = hNode;
                                    hierarchyPointerPrevious = true;
                                }
                                else {
                                    $scope.breadcrumb.push({
                                        url: $scope.link(hNode, hierarchyPointer),
                                        name: hierarchyPointerPrevious ? hierarchyPointer.title[$scope.language] : hNode.title[$scope.language]
                                    });
                                    hierarchyPointerPrevious = false;
                                }
                            });

                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    });

                    return deferred.promise;
                };

            }]);


})();