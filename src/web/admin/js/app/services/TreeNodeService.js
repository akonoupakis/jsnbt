/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('TreeNodeService', function ($q, $cacheFactory, $fn, FileService) {
            var TreeNodeService = {};
            
            var cache = $cacheFactory('NestableCache');

            var getNodes = function (parentIds, entities) {
                var deferred = $q.defer();
                
                if (parentIds.length > 0) {
                    dpd.nodes.get({
                        parent: {
                            $in: parentIds
                        },
                        entity: {
                            $in: entities
                        },
                        "$sort": { "order": 1 }
                    }, function (results, error) {
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

                dpd.nodes.get({
                    domain: domain,
                    parent: {
                        $in: parentIds
                    },
                    entity: {
                        $in: entities
                    },
                    "$sort": { "order": 1 }
                }, function (results, error) {
                    if (error)
                        deferred.reject(error);
                    else {
                        deferred.resolve(results);
                    }
                });

                return deferred.promise;
            };

            var getDraftNodes = function (ids) {
                var deferred = $q.defer();

                dpd.drafts.get({
                    refId: {
                        $in: ids
                    },
                    collection: 'nodes',
                    user: 'test'
                }, function (results, error) {
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
                    dpd.nodes.get({
                        id: {
                            $in: ids
                        }
                    }, function (results, error) {
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
            
            var getPatchedNodes = function (options, nodes, draftNodes, expandedNodeIds, root) {
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
                    var childCount = _.filter(nodes, function (x) { return x.parent === nodeParentId && x.domain === nodeDomain && options.restricted.indexOf(x.id) === -1 && options.entities.indexOf(x.entity) !== -1; }).length;

                    var draft = _.find(draftNodes, function (x) { return x.refId === result.id; });
                    if (draft) {
                        result.draft = true;
                        result.draftId = draft.id;
                    }

                    if (result.entity === 'pointer') {
                        var pointedNode = _.first(_.filter(nodes, function (x) {
                            return x.id === result.pointer.nodeId;
                        }));
                        if (pointedNode) {
                            result.pointer.entity = pointedNode.entity;
                        }
                    }

                    var parentNode = _.first(_.filter(nodes, function (x) { return x.id === result.parent; }));
                    if (parentNode)
                        result.parent = parentNode;
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
                        
                        result.children = getPatchedNodes(patchedOpts, nodes, draftNodes, expandedNodeIds);
                        if (result.children.length === result.childCount)
                            result.collapsed = false;
                    }

                    result.editUrl = $fn.invoke(nodeDomain, 'url.getEditUrl', [result]);
                    result.viewUrl = $fn.invoke(nodeDomain, 'url.getViewUrl', [result]);

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
                                }, function (error) {
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
                
                if (!options.entities)
                    opts.entities = _.pluck(_.filter(jsnbt.entities, function (x) { return x.treeNode !== false; }), 'name');
                
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

                                        getDraftNodes(resultIds).then(function (draftNodes) {
                                            var patchedNodes = getPatchedNodes(opts, nodes, draftNodes, expandedNodeIds, isRoot);
                                            deferred.resolve(patchedNodes);
                                        }, function (draftNodesError) {
                                            deferred.reject(draftNodesError);
                                        });
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
                    if (child.selected)
                        results.push(child.id);
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

            var parentFolders = function (parent, nodes) {
                $(nodes).each(function (n, node) {
                    node.parent = parent;
                });
                return nodes;
            };

            var getExclusiveFolders = function (data) {
                return _.filter(data, function (x) { return x.type === 'folder'; });
            };

            var getPatchedFolders = function (options, level, parts, partUrls, data, childPathUrls, childrenResponse, parent, root) {
                var results = [];

                var rootNode = {
                    id: '/',
                    name: '/',
                    path: '/',
                    childCount: 0,
                    children: [],
                    root: true,
                    expand: function () { },
                    collapse: function () { }
                };

                var internalFolders = getExclusiveFolders(data[level]);

                $(internalFolders).each(function (r, result) {

                    var restricted = options.restricted.indexOf(result.path) !== -1;
                    if (restricted)
                        return;

                    result.id = result.path;

                    result.childCount = 0;
                    result.children = [];
                    result.expandable = !restricted;
                    result.collapsed = true;

                    if (childPathUrls.indexOf(result.path) !== -1) {
                        var childPathResponse = getExclusiveFolders(_.filter(childrenResponse[childPathUrls.indexOf(result.path)], function (x) { return options.restricted.indexOf(x.path) === -1; }));
                        result.childCount = childPathResponse.length;
                        result.children = [];
                    }

                    var leveledName = parts[level + 1];

                    var parentNode = parent;
                    if (parentNode)
                        result.parent = parentNode;
                    else {
                        result.parent = rootNode;
                        result.parent.children.push(result);
                        result.parent.childCount++;
                    }

                    if (leveledName && leveledName === result.name) {
                        result.children = getPatchedFolders(options, level + 1, parts, partUrls, data, childPathUrls, childrenResponse, result);
                        if (result.children.length === result.childCount) {
                            result.collapsed = false;
                        }
                    }

                    result.expand = function () {
                        var resultItem = this;

                        if (resultItem.loading)
                            return;

                        if (resultItem.childCount > 0) {
                            if (resultItem.children.length !== resultItem.childCount) {
                                resultItem.loading = true;

                                var expandOpts = {};
                                $.extend(true, expandOpts, options, {
                                    path: resultItem.path
                                });

                                getCombinedFolders(expandOpts, false, resultItem, false).then(function (childNodes) {
                                    resultItem.children = parentFolders(resultItem, childNodes);
                                    resultItem.loading = false;
                                    resultItem.collapsed = false;
                                }, function (childError) {
                                    resultItem.loading = false;
                                    resultItem.collapsed = false;

                                    throw childError;
                                });

                            }
                            else {
                                resultItem.loading = false;
                                resultItem.collapsed = false;
                            }
                        }
                        else {
                            resultItem.loading = false;
                            resultItem.collapsed = false;
                        }
                    };

                    result.collapse = function () {
                        this.loading = false;
                        this.collapsed = true;
                    };

                    results.push(result);
                });

                return root ? [rootNode] : results;
            };

            var getCombinedFolders = function (options, reverse, parent, root) {
                var deferred = $q.defer();
                
                var optsDefault = {
                    identifier: undefined,
                    path: '/',
                    restricted: []
                };

                var opts = {};
                $.extend(true, opts, optsDefault, options);

                var reversed = reverse !== undefined ? reverse : true;
                
                var pathParts = opts.path.split('/');

                var pathUrls = [];
                if (reversed) {
                    pathUrls.push('/');
                    
                    var loopUrl = '';
                    $(pathParts).each(function (i, item) {
                        if (item !== '') {
                            loopUrl += '/' + item;
                            pathUrls.push(loopUrl);
                        }
                    });
                }
                else {
                    pathUrls.push(opts.path);
                }

                var isRoot = root !== undefined ? root : true;
                
                FileService.get(pathUrls).then(function (rootResponse) {

                    var childPathUrls = [];
                    $(rootResponse).each(function (r, rootChilds) {
                        var rootChildPaths = _.pluck(getExclusiveFolders(rootChilds), 'path');
                        childPathUrls = _.union(childPathUrls, rootChildPaths);
                    });

                    FileService.get(childPathUrls).then(function (childrenResponse) {
                        var patchedFolders = getPatchedFolders(opts, 0, pathParts, pathUrls, rootResponse, childPathUrls, childrenResponse, parent, isRoot);
                        deferred.resolve(patchedFolders);
                    }, function (childrenError) {
                        deferred.reject(childrenError);
                    });

                }, function (rootError) {
                    deferred.reject(rootError);
                });

                return deferred.promise;
            };

            TreeNodeService.getNodes = function (options) {
                var deferred = $q.defer();
                
                getCombinedNodes(options).then(function (results) {
                    deferred.resolve(results);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            TreeNodeService.getFolders = function (options) {
                var deferred = $q.defer();

                getCombinedFolders(options).then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            TreeNodeService.getSelected = function (nodes) {
                var results = [];

                $(nodes).each(function (n, node) {
                    getNodeSelected(node, results);
                });

                return results;
            };

            TreeNodeService.setSelected = function (nodes, ids) {
                $(nodes).each(function (n, node) {
                    setNodeSelected(node, ids);
                });
            };

            return TreeNodeService;
        });
})();