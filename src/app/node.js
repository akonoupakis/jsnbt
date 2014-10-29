var app = require('./app.js');
var cache = require('./cache.js');
var jsnbt = require('./jsnbt.js');
var entity = require('./entity.js');
var parseUri = require('parseUri');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function(dpd) {

    var getEntity = function (name) {
        return entity(name);
    };

    var resolveHierarchy = function (nodes, node, cb) {
        if (node.parent && node.parent !== '') {
            dpd.nodes.get(node.parent, function (result, error) {
                if (error)
                    throw error;
                else {
                    nodes.reverse();
                    nodes.push(result);
                    nodes.reverse();

                    resolveHierarchy(nodes, result, cb);
                }
            })
        }
        else {
            cb(nodes);
        }
    };

    var getDefaultLanguage = function (cb) {

        if (jsnbt.localization) {
            cb('en');
        }
        else {
            var defaultLanguage = 'en';

            dpd.languages.get({ active: true, "default": true }, function (defaultLanguages, defaultLanguagesError) {
                if (defaultLanguagesError)
                    throw defaultLanguagesError;
                else {
                    if (defaultLanguages.length > 0)
                        defaultLanguage = _.first(defaultLanguages).code;

                    cb(defaultLanguage || 'en');
                }
            });
        }

    };

    var getActiveLanguages = function (cb) {

        if (jsnbt.localization) {
            cb(['en']);
        }
        else {
            dpd.languages.get({ active: true }, function (dbLanguages, dbLanguagesError) {
                if (dbLanguagesError)
                    throw dbLanguagesError;
                else
                    cb(_.pluck(dbLanguages, 'code'));
            });
        }

    };

    var resolvePointerUrl = function (returnObj, seoNodes, urlPath, url, cb) {
        dpd.nodes.get({ id: returnObj.pointer.pointer.nodeId, domain: returnObj.pointer.pointer.domain }, function (pointedNode, pointedNodeError) {
            if (pointedNodeError)
                throw pointedNodeError;
            else if (!pointedNode)
                throw new Error('pointed node not found');
            else {
                var pointedSeoNames = _.str.trim(urlPath, '/') !== '' ? _.str.trim(urlPath, '/').split('/') : [];
                var pack = _.first(_.filter(app.packages, function (x) { return x.domain === pointedNode.domain && typeof (x.resolve) === 'function'; }));
                if (pack) {
                    returnObj.seoNames = pointedSeoNames;
                    returnObj.pointed = pointedNode;
                    returnObj.dpd = dpd;
                    pack.resolve(returnObj, cb);
                }
                else {
                    if (pointedSeoNames.length === 0) {
                        returnObj.page = pointedNode;
                        returnObj.view = pointedNode.view;
                        returnObj.nodes = _.union(returnObj.nodes, pointedNode);
                        cb(returnObj);
                    }
                    else {
                        var pointedLoopParentId = pointedNode.id;
                        var pointedFoundNodes = [pointedNode];
                        var pointedFoundAllMatches = true;

                        _.each(pointedSeoNames, function (pointedSeoName) {
                            var matchedPointedSeoNode = _.first(_.filter(seoNodes, function (x) {
                                return x.url[jsnbt.localization ? returnObj.language : 'en'].toLowerCase() === pointedSeoName.toLowerCase() &&
                                    x.parent === pointedLoopParentId &&
                                    x.domain === pointedNode.domain;
                            }));
                            if (matchedPointedSeoNode) {
                                pointedFoundNodes.push(matchedPointedSeoNode);
                                pointedLoopParentId = matchedPointedSeoNode.id;
                            }
                            else {
                                pointedFoundAllMatches = false;
                                return false;
                            }
                        });

                        if (pointedFoundAllMatches) {
                            var targetMatchedNode = _.last(pointedFoundNodes);
                            if (targetMatchedNode) {
                                returnObj.page = targetMatchedNode;
                                returnObj.view = targetMatchedNode.view;
                                returnObj.nodes = _.union(returnObj.nodes, pointedFoundNodes);
                                cb(returnObj);
                            }
                            else {
                                cb();
                            }
                        }
                        else {
                            cb();
                        }
                    }
                }
            }
        });
    };

    var resolveUrl = function (returnObj, language, url, query, cb) {
        
        var seoNames = _.str.trim(url, '/').split('/');

        var seoNamesQuery = {};
        seoNamesQuery['url.' + (jsnbt.localization ? language : 'en')] = { $in: seoNames };

        dpd.nodes.get(seoNamesQuery, function (urlSeoNodes, urlSeoNodesError) {
            if (urlSeoNodesError)
                throw urlSeoNodesError;
            else {
                var loopParentId = '';
                var foundNodes = [];
                var foundAllMatches = true;
                var buildUrl = '';

                _.each(seoNames, function (seoName) {
                    var matchedSeoNode = _.first(_.filter(urlSeoNodes, function (x) {
                        return x.url[jsnbt.localization ? language: 'en'].toLowerCase() === seoName.toLowerCase() &&
                            x.parent === loopParentId &&
                            x.domain === 'core';
                    }));
                    if (matchedSeoNode) {
                        foundNodes.push(matchedSeoNode);
                        loopParentId = matchedSeoNode.id;
                        buildUrl += '/' + seoName;
                    }
                    else {
                        foundAllMatches = false;
                        return false;
                    }
                });

                var matchedNode = undefined;
                if (foundAllMatches) {
                    matchedNode = _.last(foundNodes);
                }
                
                if (matchedNode) {
                    if (matchedNode.entity === 'pointer') {
                        returnObj.language = language;
                        returnObj.nodes = foundNodes;
                        returnObj.pointer = matchedNode;
                        resolvePointerUrl(returnObj, urlSeoNodes, '/', '/' + query, cb);
                    }
                    else {
                        returnObj.page = matchedNode;
                        returnObj.nodes = foundNodes;
                        returnObj.language = language;
                        returnObj.view = matchedNode.view;
                        cb(returnObj);
                    }
                }
                else {
                    var pointerNode = _.last(_.filter(foundNodes, function (x) { return x.entity === 'pointer' }));

                    if (pointerNode) {
                        var trimmedUrl = url.length > buildUrl.length ? url.substring(buildUrl.length) : '';
                        if (trimmedUrl === '')
                            trimmedUrl = '/';

                        var fullUrlPart = trimmedUrl + query;

                        returnObj.language = language;
                        returnObj.nodes = foundNodes;
                        returnObj.pointer = pointerNode;
                        resolvePointerUrl(returnObj, urlSeoNodes, trimmedUrl, fullUrlPart, cb);
                    }
                    else {
                        cb();
                    }
                }
            }
        });
    };
    
    return {

        getHierarchy: function (node, cb) {

            resolveHierarchy([node], node, cb);

        },

        resolveUrl: function (url, cb) {
            var returnObj = {
                page: undefined,
                pointer: undefined,
                nodes: [],
                language: undefined,
                view: undefined,
                isActive: function () {
                    var rSelf = this;
                    return _.every(rSelf.nodes, function (x) { return x.active[rSelf.language] === true; });
                },
                isPublished: function () {
                    var rSelf = this;
                    return _.every(rSelf.nodes, function (x) { return x.published === true; });
                },
                getPermissions: function () {
                    var rSelf = this;

                    var rRoles = ['public'];

                    _.each(rSelf.nodes, function (rnode) {
                        if (!rnode.permissions.inherits) {
                            rRoles = rnode.permissions.roles.slice(0);
                        }
                    });

                    return rRoles;
                }
            };

            var self = this;

            var uri = parseUri(url);
            uri.path = uri.path.toLowerCase();


            var languagePart = '';
            var urlPart = '';

            getDefaultLanguage(function (defaultLanguage) {

                if (uri.path === '/') {
                    var languagePart = defaultLanguage;
                    var urlPart = uri.path;

                    dpd.settings.get({ domain: 'core' }, function (settingNodes, settingNodesError) {
                        if (settingNodesError)
                            throw settingNodesError;
                        else {
                            var settingNode = _.first(settingNodes);
                            if (settingNode && settingNode.data && settingNode.data.homepage) {

                                dpd.nodes.get(settingNode.data.homepage, function (resolvedNode, resolvedNodeError) {
                                    if (resolvedNodeError)
                                        throw resolvedNodeError;
                                    else {
                                        dpd.nodes.get({ hierarchy: resolvedNode.hierarchy }, function (resolvedHierarchyNodes, resolvedHierarchyNodesError) {
                                            if (resolvedHierarchyNodesError) {
                                                throw resolvedHierarchyNodesError;
                                            }
                                            else {
                                                var resolvedNodes = [];
                                                _.each(resolvedNode.hierarchy, function (rh) {
                                                    var resolvedNode = _.first(_.filter(resolvedHierarchyNodes, function (x) { return x.id === rh; }));
                                                    if (resolvedNode)
                                                        resolvedNodes.push(resolvedNode);
                                                });

                                                returnObj.page = resolvedNode;
                                                returnObj.nodes = resolvedNodes;
                                                returnObj.language = defaultLanguage;
                                                returnObj.view = resolvedNode.view;

                                                cb(returnObj);
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                cb();
                            }
                        }
                    });
                }
                else {
                    if (jsnbt.localization) {
                        getActiveLanguages(function (activeLanguages) {
                            if (activeLanguages.length > 0) {
                                var parts = _.str.trim(uri.path, '/').split('/');
                                var firstPart = _.first(parts);
                                if (activeLanguages.indexOf(firstPart.toLowerCase()) != -1) {
                                    languagePart = firstPart.toLowerCase();
                                    urlPart = '/' + parts.slice(1).join('/');

                                    resolveUrl(returnObj, languagePart, urlPart, (uri.query !== '' ? '?' + uri.query : ''), cb);
                                }
                                else {
                                    cb();
                                }
                            }
                            else {
                                cb();
                            }
                        });
                    }
                    else {
                        languagePart = 'en';
                        urlPart = _.str.rtrim(uri.path, '/');

                        resolveUrl(returnObj, languagePart, urlPart, (uri.query !== '' ? '?' + uri.query : ''), cb);
                    }
                }

            });
        },

        buildUrl: function (node, cb) {
            var self = this;

            var result = {};

            var parentHierarchy = [];
            if (node.parent !== '' && node.hierarchy.length > 1) {
                parentHierarchy = node.hierarchy.slice(0);
                parentHierarchy.pop();
            }

            if (parentHierarchy.length > 0) {
                var parentCacheKey = parentHierarchy.join('.');
                if (cache.url[parentCacheKey]) {
                    var cachedUrl = cache.url[parentCacheKey];

                    var newUrl = {};
                    _.extend(newUrl, node.url);
                    for (var langItem in node.url) {
                        var seoName = node.url[langItem];
                        if (cachedUrl[langItem]) {
                            newUrl[langItem] = cachedUrl[langItem] + '/' + seoName
                        }
                        else {
                            delete newUrl[langItem];
                        }
                    }

                    cb(newUrl);
                }
                else {
                    dpd.nodes.get({ id: { $in: parentHierarchy } }, function (results, error) {
                        if (error) {
                            throw error;
                        }
                        else {
                            var hierarchyNodes = [];
                            var allHierarchyNodes = true;

                            _.each(parentHierarchy, function (selfHierarchy) {
                                var hNode = _.first(_.filter(results, function (x) { return x.id == selfHierarchy; }));
                                if (hNode)
                                    hierarchyNodes.push(hNode);
                                else {
                                    allHierarchyNodes = false;
                                    return false;
                                }
                            });

                            if (allHierarchyNodes) {
                                var parentUrl = {};
                                var firstNode = _.first(hierarchyNodes);

                                var lastNode = _.last(hierarchyNodes);

                                _.extend(parentUrl, lastNode.url);

                                var urlKeys = getEntity(node.entity).isSeoNamed() ? node.url : lastNode.url;
                                
                                for (var langItem in urlKeys) {
                                    var langUrl = '';
                                    var fullyResolved = true;
                                    if (_.filter(jsnbt.languages, function (x) { return x.code === langItem; }).length > 0) {
                                        _.each(hierarchyNodes, function (hnode) {
                                            if (hnode.url[langItem]) {
                                                langUrl += '/' + hnode.url[langItem];
                                            }
                                            else {
                                                langUrl = '';
                                                fullyResolved = false;
                                                return false;
                                            }
                                        });
                                    }

                                    if (langUrl !== '' && fullyResolved) {
                                        var resolvedLangUrl = '';
                                        if (lastNode.domain === 'core' && jsnbt.localization && getEntity(lastNode.entity).isLocalized()) {
                                            resolvedLangUrl += '/' + langItem;
                                        }

                                        resolvedLangUrl += langUrl;
                                        parentUrl[langItem] = resolvedLangUrl;
                                    }
                                    else {
                                        delete parentUrl[langItem];
                                    }
                                }

                                var newUrl = {};                                
                                cache.url[parentCacheKey] = parentUrl;

                                var pack = _.first(_.filter(app.packages, function (x) { return x.domain === firstNode.domain && typeof (x.build) === 'function'; }));
                                if (pack) {
                                    _.extend(newUrl, parentUrl);
                                    
                                    pack.build({
                                        nodes: hierarchyNodes,
                                        node: node,
                                        url: newUrl
                                    }, cb);
                                }
                                else {
                                    _.extend(newUrl, node.url);
                                    for (var langItem in node.url) {
                                        if (parentUrl[langItem])
                                            newUrl[langItem] = parentUrl[langItem] + '/' + node.url[langItem];
                                        else
                                            delete newUrl[langItem];
                                    }

                                    cb(newUrl);
                                }
                            }
                            else {
                                cb({});
                            }
                        }
                    });
                }
            }
            else {

                var pack = _.first(_.filter(app.packages, function (x) { return x.domain === node.domain && typeof (x.build) === 'function'; }));
                if (pack) {
                    pack.build({
                        nodes: [],
                        node: node,
                        url: {}
                    }, cb);
                }
                else {
                    var newUrl = {};
                    _.extend(newUrl, node.url);
                    for (var langItem in node.url) {
                        var seoName = node.url[langItem];
                        var resolvedLangUrl = '';
                        if (node.domain === 'core' && jsnbt.localization && getEntity(node.entity).isLocalized()) {
                            resolvedLangUrl += '/' + langItem;
                        }
                        resolvedLangUrl += '/' + seoName;
                        newUrl[langItem] = resolvedLangUrl;
                    }

                    cb(newUrl);
                }
            }
        }

    };

};