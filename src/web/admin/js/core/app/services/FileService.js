/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('FileService', ['$q', '$http', function ($q, $http) {
            var FileService = {};
         
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

            FileService.get = function (paths) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/file/get';
                $http.post(url, {
                    path: typeof (paths) === 'string' ? paths : undefined,
                    paths: typeof (paths) !== 'string' ? paths : undefined
                }).then(function (data) {
                    if (!!data && !!data.data) {                        
                        deferred.resolve(data.data);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            FileService.create = function (path, name) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/file/create';
                $http.post(url, {
                    path: path,
                    name: name
                }).then(function (data) {
                    if (!!data && !!data.data) {
                        deferred.resolve(data.data);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            FileService.move = function (path, newPath) {
                var deferred = $q.defer();
                
                var url = '../jsnbt-api/core/file/move';
                $http.post(url, {
                    from: path,
                    to: newPath
                }).then(function (data) {
                    if (!!data && !!data.data) {
                        deferred.resolve(data.data);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };
            
            FileService.delete = function (path) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/file/delete';
                $http.post(url, {
                    path: path
                }).then(function (data) {
                    if (!!data && !!data.data) {
                        deferred.resolve(data.data);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            FileService.getFolders = function (options) {
                var deferred = $q.defer();

                getCombinedFolders(options).then(function (response) {
                    deferred.resolve(response);
                }).catch(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            FileService.getSelected = function (nodes) {
                var results = [];

                $(nodes).each(function (n, node) {
                    getNodeSelected(node, results);
                });

                return results;
            };

            FileService.setSelected = function (nodes, ids) {

                $(nodes).each(function (n, node) {
                    setNodeUnselected(node);
                });

                $(nodes).each(function (n, node) {
                    setNodeSelected(node, ids);
                });
            };

            return FileService;
        }]);
})();