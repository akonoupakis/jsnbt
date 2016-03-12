/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('NodeService', ['$q', '$jsnbt', '$data', '$cacheFactory', 'FileService', function ($q, $jsnbt, $data, $cacheFactory, FileService) {
            var NodeService = {};
            
            var cache = $cacheFactory('NestableCache');

            var getNodes = function (parentIds, entities) {
                var deferred = $q.defer();
                
                if (parentIds.length > 0) {
                    jsnbt.db.nodes.get({
                        parent: {
                            $in: parentIds
                        },
                        entity: {
                            $in: entities
                        },
                        "$sort": { "order": 1 }
                    }, function (error, results) {
                        if (error)
                            deferred.reject(error);
                        else {
                            deferred.resolve(results);
                        }
                    });
                }
                else {
                    deferred.resolve([]);
                }

                return deferred.promise;
            };

            var getDomainNodes = function (domain, parentIds, entities) {
                var deferred = $q.defer();

                jsnbt.db.nodes.get({
                    domain: domain,
                    parent: {
                        $in: parentIds
                    },
                    entity: {
                        $in: entities
                    },
                    "$sort": { "order": 1 }
                }, function (error, results) {
                    if (error)
                        deferred.reject(error);
                    else {
                        deferred.resolve(results);
                    }
                });

                return deferred.promise;
            };
            
            var getPointedNodes = function (ids) {
                var deferred = $q.defer();

                if (ids.length > 0) {
                    jsnbt.db.nodes.get({
                        id: {
                            $in: ids
                        }
                    }, function (error, results) {
                        if (error)
                            deferred.reject(error);
                        else {
                            deferred.resolve(results);
                        }
                    });
                }
                else {
                    deferred.resolve([]);
                }

                return deferred.promise;
            };

            var parentNodes = function (parent, nodes) {
                $(nodes).each(function (n, node) {
                    node.parent = parent;
                });
                return nodes;
            };

            var appendChildExpandedInfo = function (ids, node) {
                if (!node.collapsed) {
                    ids.push(node.entity === 'pointer' ? node.pointer.nodeId : node.id);

                    if (node.childCount > 0) {
                        $(node.children).each(function (i, item) {
                            appendChildExpandedInfo(ids, item);
                        });
                    }
                }
            };

            var getExpandedNodeIds = function (node) {
                var ids = [];

                var parentNode = node.parent;
                while (parentNode.id !== '')
                    parentNode = parentNode.parent;

                $(parentNode.children).each(function (i, item) {
                    appendChildExpandedInfo(ids, item);
                });
                
                return ids;
            };

            var cacheExpandedNodeIds = function (identifier, ids) {
                if (identifier && identifier !== null)
                    cache.put(identifier, ids);
            };

            var getCachedExpandedNodeIds = function (identifier) {
                if (identifier && identifier !== null)
                    return cache.get(identifier) || [];
                else
                    return [];
            };
            
            var getPatchedNodes = function (options, nodes, expandedNodeIds, root) {
                var results = [];

                var filteredNodes = _.filter(nodes, function (x) { return x.parent === options.parentId && x.domain === options.domain; });

                var rootNode = {
                    id: '',
                    name: 'root',
                    entity: 'root',
                    childCount: 0,
                    children: [],
                    root: true,
                    expand: function () { },
                    collapse: function () { }
                };

                $(filteredNodes).each(function (n, result) {

                    var restricted = options.restricted.indexOf(result.id) !== -1;
                    if (restricted)
                        return;

                    var nodeDomain = result.entity === 'pointer' ? result.pointer.domain : result.domain;
                    var nodeParentId = result.entity === 'pointer' ? result.pointer.nodeId : result.id;

                    var childCount = _.filter(nodes, function (x) {
                        return (typeof(x.parent) === 'string' ? x.parent : x.parent.id) === nodeParentId &&
                            x.domain === nodeDomain &&
                            options.restricted.indexOf(x.id) === -1 &&
                            options.entities.indexOf(x.entity) !== -1;
                    }).length;
                    
                    if (result.entity === 'pointer') {
                        var pointedNode = _.first(_.filter(nodes, function (x) {
                            return x.id === result.pointer.nodeId;
                        }));
                        if (pointedNode) {
                            result.pointer.entity = pointedNode.entity;
                        }
                    }

                    var parentNode = _.first(_.filter(nodes, function (x) { return x.id === result.parent; }));
                    if (parentNode) {
                        result.parent = parentNode;
                    }
                    else {
                        result.parent = rootNode;
                        result.parent.children.push(result);
                        result.parent.childCount++;
                    }
                    
                    result.childCount = childCount;
                    result.children = [];
                    result.collapsed = true;
                    result.expandable = true;
                    
                    if (expandedNodeIds.indexOf(nodeParentId) !== -1) {
                        var patchedOpts = {};
                        $.extend(true, patchedOpts, options, {
                            domain: nodeDomain,
                            parentId: nodeParentId
                        });
                        
                        result.children = getPatchedNodes(patchedOpts, nodes, expandedNodeIds);
                        if (result.children.length === result.childCount)
                            result.collapsed = false;
                    }

                    result.expand = function () {
                        var resultItem = this;

                        if (resultItem.loading)
                            return;

                        if (resultItem.childCount > 0) {
                            if (resultItem.children.length !== resultItem.childCount) {
                                resultItem.loading = true;

                                var combineOpts = {};
                                $.extend(true, combineOpts, options, {
                                    domain: resultItem.entity === 'pointer' ? resultItem.pointer.domain : resultItem.domain,
                                    parentId: resultItem.entity === 'pointer' ? resultItem.pointer.nodeId : resultItem.id
                                });

                                getCombinedNodes(combineOpts, false).then(function (childNodes) {
                                    resultItem.children = parentNodes(resultItem, childNodes);
                                    resultItem.loading = false;
                                    resultItem.collapsed = false;

                                    cacheExpandedNodeIds(options.identifier, getExpandedNodeIds(resultItem));
                                }).catch(function (error) {
                                    resultItem.loading = false;
                                    resultItem.collapsed = false;

                                    cacheExpandedNodeIds(options.identifier, getExpandedNodeIds(resultItem));

                                    throw error;
                                });
                            }
                            else {
                                resultItem.loading = false;
                                resultItem.collapsed = false;

                                cacheExpandedNodeIds(options.identifier, getExpandedNodeIds(resultItem));
                            }
                        }
                        else {
                            resultItem.loading = false;
                            resultItem.collapsed = false;

                            cacheExpandedNodeIds(options.identifier, getExpandedNodeIds(resultItem));
                        }
                    };

                    result.collapse = function () {
                        this.loading = false;
                        this.collapsed = true;

                        cacheExpandedNodeIds(options.identifier, getExpandedNodeIds(this));
                    };
                    
                    results.push(result);
                });

                return root ? [rootNode] : results;
            };
            
            var getCombinedNodes = function (options, root) {
                var deferred = $q.defer();

                var optionsDefault = {
                    identifier: null,
                    domain: '',
                    parentId: '',
                    parentIds: [],
                    entities: [],
                    restricted: []
                };

                var opts = {};
                $.extend(true, opts, optionsDefault, options);
                
                if (!options.entities) {
                    opts.entities = [];

                    for (var entityName in $jsnbt.entities) {
                        if ($jsnbt.entities[entityName].treeNode !== false)
                            opts.entities.push(entityName);

                        if ($jsnbt.entities[entityName].pointed)
                            opts.entities.push(entityName);
                    }
                }
                
                var isRoot = root !== undefined ? root : true;

                var newParentIds = [];
                newParentIds.push(opts.parentId);
                if (opts.parentIds) {
                    $(opts.parentIds).each(function (i, item) {
                        newParentIds.push(item);
                    });
                }

                var expandedNodeIds = getCachedExpandedNodeIds(opts.identifier) || [];

                $(opts.parentIds).each(function (i, item) {
                    expandedNodeIds.push(item);
                });

                if (expandedNodeIds) {
                    $(expandedNodeIds).each(function (i, item) {
                        if (newParentIds.indexOf(item) === -1)
                            newParentIds.push(item);
                    });
                }

                if (newParentIds.length === 0) {
                    deferred.resolve([]);
                }
                else {
                    getNodes(expandedNodeIds, opts.entities).then(function (expandedNodes) {
                        $(expandedNodes).each(function (e, expandedNode) {
                            $(expandedNode.hierarchy).each(function (h, hi) {
                                if (newParentIds.indexOf(hi) === -1)
                                    newParentIds.push(hi);
                            });
                        });

                        getDomainNodes(opts.domain, newParentIds, opts.entities).then(function (nodes) {
                            
                            var resultIds = _.pluck(nodes, 'id');
                            
                            var pointedNodeIds = _.pluck(_.pluck(_.filter(nodes, function (x) { return x.entity === 'pointer'; }), 'pointer'), 'nodeId');
                            $(pointedNodeIds).each(function (i, item) {
                                if (resultIds.indexOf(item) === -1)
                                    resultIds.push(item);
                            });

                            $(expandedNodes).each(function (e, extra) {
                                if(_.filter(nodes, function(x){ return x.id === extra.id; }).length === 0)
                                    nodes.push(extra);
                            });

                            var expandedPointedNodeIds = _.pluck(_.pluck(_.filter(expandedNodes, function (x) { return x.entity === 'pointer'; }), 'pointer'), 'nodeId');                            
                            $(expandedPointedNodeIds).each(function (i, item) {
                                if (resultIds.indexOf(item) === -1)
                                    resultIds.push(item);
                            });

                            if (resultIds.length === 0) {
                                deferred.resolve(nodes);
                            }
                            else {
                                getPointedNodes(pointedNodeIds).then(function (pointedNodes) {

                                    $(pointedNodes).each(function (n, node) {
                                        if (_.filter(nodes, function (x) { return x.id === node.id; }).length === 0)
                                            nodes.push(node);
                                    });

                                    getNodes(resultIds, opts.entities).then(function (childNodes) {
                                        $(childNodes).each(function (n, node) {
                                            if (_.filter(nodes, function (x) { return x.id === node.id; }).length === 0)
                                                nodes.push(node);
                                        });

                                        var patchedNodes = getPatchedNodes(opts, nodes, expandedNodeIds, isRoot);
                                        deferred.resolve(patchedNodes);
                                    }, function (childNodesError) {
                                        deferred.reject(childNodesError);
                                    });
                                }, function (pointedNodesError) {
                                    deferred.reject(pointedNodesError);
                                });
                            }
                        }, function (nodesError) {
                            deferred.reject(nodesError);
                        });
                    }, function (extrasError) {
                        throw extrasError;
                    });
                }

                return deferred.promise;
            };

            var getNodeSelected = function (node, results) {
                if (node.selected)
                    results.push(node.id);

                $(node.children).each(function (n, child) {
                    getNodeSelected(child, results);
                });
            };

            var setNodeSelected = function (node, ids) {
                if (ids.indexOf(node.id) !== -1) {
                    node.selected = true;
                }

                $(node.children).each(function (n, child) {
                    setNodeSelected(child, ids);
                });
            };

            var setNodeUnselected = function (node) {
                node.selected = false;
                
                $(node.children).each(function (n, child) {
                    setNodeUnselected(child);
                });
            };

            NodeService.getNodes = function (options) {
                var deferred = $q.defer();
                
                getCombinedNodes(options).then(function (results) {
                    deferred.resolve(results);
                }).catch(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };
            
            NodeService.getSelected = function (nodes) {
                var results = [];

                $(nodes).each(function (n, node) {
                    getNodeSelected(node, results);
                });

                return results;
            };

            NodeService.setSelected = function (nodes, ids) {

                $(nodes).each(function (n, node) {
                    setNodeUnselected(node);
                });

                $(nodes).each(function (n, node) {
                    setNodeSelected(node, ids);
                });
            };

            NodeService.getBreadcrumb = function (node, language, prefix) {

                var deferred = $q.defer();

                var setLocInternal = function (hierarchy) {
                    $data.nodes.get({ id: { $in: hierarchy } }).then(function (results) {

                        var breadcrumb = [];
                        
                        $(hierarchy).each(function (i, item) {
                            if (item === 'new') {
                                breadcrumb.push({
                                    name: 'new',
                                    url: '',
                                    active: true
                                });
                            }
                            else {
                                var resultNode = _.first(_.filter(results, function (x) { return x.id === item; }));
                                if (resultNode) {

                                    var nameValue = resultNode.title[language];

                                    var url = '';
                                    if ($jsnbt.entities[resultNode.entity].viewable)
                                        url = $jsnbt.entities[resultNode.entity].getViewUrl(resultNode, prefix);
                                    else if ($jsnbt.entities[resultNode.entity].editable)
                                        url = $jsnbt.entities[resultNode.entity].getEditUrl(resultNode, prefix);

                                    breadcrumb.push({
                                        id: item,
                                        name: nameValue,
                                        url: url,
                                        active: i === (hierarchy.length - 1)
                                    });
                                }
                            }
                        });

                        deferred.resolve(breadcrumb);

                    }).catch(function (error) {
                        deferred.reject(error);
                    });
                };

                var hierarchy = [];
                if (node) {
                    if (node.parent && node.parent !== '') {
                        $data.nodes.get(node.parent).then(function (nodeResult) {
                            hierarchy = nodeResult.hierarchy.slice(0);
                            if (node.id)
                                hierarchy.push(node.id);

                            setLocInternal(hierarchy);
                        }, function (parentError) {
                            deferred.reject(parentError);
                        });
                    }
                    else {
                        hierarchy = [];
                        if (node.id)
                            hierarchy.push(node.id);

                        setLocInternal(hierarchy);
                    }
                }
                else {
                    setLocInternal([]);
                }

                return deferred.promise;
            };

            return NodeService;
        }]);
})();