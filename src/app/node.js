var app = require('./app.js');
var cache = require('./cache.js');
var jsnbt = require('./jsnbt.js');
var entity = require('./entity.js');
var parseUri = require('parseUri');
var extend = require('extend');
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
        else {
            cb('en');
        }

    };

    var getActiveLanguages = function (cb) {

        if (jsnbt.localization) {
            dpd.languages.get({ active: true }, function (dbLanguages, dbLanguagesError) {
                if (dbLanguagesError)
                    throw dbLanguagesError;
                else
                    cb(_.pluck(dbLanguages, 'code'));
            });
        }
        else {
            cb(['en']);
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
                var pack = _.first(_.filter(jsnbt.modules, function (x) {
                    return x.domain === pointedNode.domain
                      && x.url && _.isObject(x.url) && _.isFunction(x.url.resolve);
                }));
                if (pack) {
                    returnObj.seoNames = pointedSeoNames;
                    returnObj.pointed = pointedNode;
                    returnObj.dpd = dpd;
                    pack.url.resolve(returnObj, cb);
                }
                else {
                    if (pointedSeoNames.length === 0) {
                        returnObj.page = pointedNode;
                        returnObj.template = pointedNode.template;
                        returnObj.nodes = _.union(returnObj.nodes, pointedNode);
                        cb(returnObj);
                    }
                    else {
                        var pointedLoopParentId = pointedNode.id;
                        var pointedFoundNodes = [pointedNode];
                        var pointedFoundAllMatches = true;

                        _.each(pointedSeoNames, function (pointedSeoName) {
                            var matchedPointedSeoNode = _.first(_.filter(seoNodes, function (x) {
                                return x.seo[jsnbt.localization ? returnObj.language : 'en'].toLowerCase() === pointedSeoName.toLowerCase() &&
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
                                returnObj.template = targetMatchedNode.template;
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
        seoNamesQuery['seo.' + (jsnbt.localization ? language : 'en')] = { $in: seoNames };

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
                        return x.seo[jsnbt.localization ? language : 'en'].toLowerCase() === seoName.toLowerCase() &&
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

                        if (matchedNode.entity === 'router') {
                            returnObj.route = matchedNode.route;
                        }

                        returnObj.nodes = foundNodes;
                        returnObj.language = language;
                        returnObj.template = matchedNode.template;
                        returnObj.dpd = dpd;
                        returnObj.url = '/';
                        cb(returnObj);
                    }
                }
                else {
                    var pointerNode = _.last(_.filter(foundNodes, function (x) { return x.entity === 'pointer' }));
                    var routerNode = _.last(_.filter(foundNodes, function (x) { return x.entity === 'router' }));

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
                    else if (routerNode) {
                        var trimmedUrl = url.length > buildUrl.length ? url.substring(buildUrl.length) : '';
                        if (trimmedUrl === '')
                            trimmedUrl = '/';

                        var fullUrlPart = trimmedUrl + query;

                        returnObj.page = routerNode;
                        returnObj.language = language;
                        returnObj.nodes = foundNodes;
                        returnObj.route = routerNode.route;
                        returnObj.template = routerNode.template;
                        returnObj.dpd = dpd;
                        returnObj.url = fullUrlPart;
                        cb(returnObj);
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
                route: undefined,
                nodes: [],
                language: undefined,
                template: undefined,
                url: url,
                isActive: function () {
                    var rSelf = this;
                    return _.every(rSelf.nodes, function (x) { return x.active[rSelf.language] === true; });
                },
                getLayout: function () {
                    var rSelf = this;

                    var layout = '';

                    _.each(rSelf.nodes, function (rnode) {
                        if (!rnode.layout.inherits) {
                            layout = rnode.layout.value;
                        }
                    });
                    
                    return layout;
                },
                getPermissions: function () {
                    var rSelf = this;

                    var rRoles = ['public'];

                    _.each(rSelf.nodes, function (rnode) {
                        if (!rnode.roles.inherits) {
                            rRoles = rnode.roles.values.slice(0);
                        }
                    });

                    return rRoles;
                },
                getRobots: function () {
                    var rSelf = this;

                    var rRobots = [];

                    _.each(rSelf.nodes, function (rnode) {
                        if (!rnode.robots.inherits) {
                            rRobots = rnode.robots.values.slice(0);
                        }
                    });

                    return rRobots;
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

                    dpd.settings.getCached({ domain: 'core' }, function (settingNodes, settingNodesError) {
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

                                                if (resolvedNode.entity == 'router') {
                                                    returnObj.route = resolvedNode.route;
                                                }

                                                returnObj.nodes = resolvedNodes;
                                                returnObj.language = defaultLanguage;
                                                returnObj.template = resolvedNode.template;

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
                    extend(true, newUrl, node.seo);
                    for (var langItem in node.seo) {
                        var seoName = node.seo[langItem];
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

                                extend(true, parentUrl, lastNode.seo);

                                var urlKeys = getEntity(node.entity).isSeoNamed() ? node.seo : lastNode.seo;
                                
                                for (var langItem in urlKeys) {
                                    var langUrl = '';
                                    var fullyResolved = true;
                                    if (_.filter(jsnbt.languages, function (x) { return x.code === langItem; }).length > 0) {
                                        _.each(hierarchyNodes, function (hnode) {
                                            if (hnode.seo[langItem]) {
                                                langUrl += '/' + hnode.seo[langItem];
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

                                var pack = _.first(_.filter(jsnbt.modules, function (x) {
                                    return x.domain === firstNode.domain
                                          && x.url && _.isObject(x.url) && _.isFunction(x.url.build);
                                }));
                                if (pack) {
                                    extend(true, newUrl, parentUrl);
                                    
                                    pack.url.build({
                                        nodes: hierarchyNodes,
                                        node: node,
                                        url: newUrl
                                    }, cb);
                                }
                                else {
                                    extend(true, newUrl, node.seo);
                                    for (var langItem in node.seo) {
                                        if (parentUrl[langItem])
                                            newUrl[langItem] = parentUrl[langItem] + '/' + node.seo[langItem];
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

                var pack = _.first(_.filter(jsnbt.modules, function (x) { return x.domain === node.domain && typeof (x.build) === 'function'; }));
                if (pack) {
                    pack.build({
                        nodes: [],
                        node: node,
                        url: {}
                    }, cb);
                }
                else {
                    var newUrl = {};
                    extend(true, newUrl, node.seo);
                    for (var langItem in node.seo) {
                        var seoName = node.seo[langItem];
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
        },

        getActiveInfo: function (node, cb) {
            var self = this;

            var result = {};

            var parentHierarchy = [];
            if (node.parent !== '' && node.hierarchy.length > 1) {
                parentHierarchy = node.hierarchy.slice(0);
                parentHierarchy.pop();
            }

            if (parentHierarchy.length > 0) {
                var parentCacheKey = parentHierarchy.join('.');
                if (cache.active[parentCacheKey]) {
                    var cachedValue = cache.active[parentCacheKey];

                    var newValue = {};
                    extend(true, newValue, node.active);
                    for (var langItem in node.active) {
                        var seoName = node.active[langItem];
                        if (cachedValue[langItem] && node.active[langItem]) {
                            newValue[langItem] = true;
                        }
                        else {
                            newValue[langItem] = false;
                        }
                    }

                    cb(newValue);
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
                                var parentActive = {};
                                var firstNode = _.first(hierarchyNodes);

                                var lastNode = _.last(hierarchyNodes);

                                extend(true, parentActive, lastNode.active);

                                for (var langItem in lastNode.active) {
                                    var langActive = true;
                                    if (_.filter(jsnbt.languages, function (x) { return x.code === langItem; }).length > 0) {
                                        _.each(hierarchyNodes, function (hnode) {
                                            if (!hnode.active[langItem]) {
                                                langActive = false;
                                                return false;
                                            }
                                        });
                                    }

                                    parentActive[langItem] = langActive;
                                }

                                var newActive = {};
                                cache.active[parentCacheKey] = parentActive;

                                extend(true, newActive, node.active);
                                for (var langItem in node.active) {
                                    if (parentActive[langItem] && node.active[langItem])
                                        newActive[langItem] = true;
                                    else
                                        newActive[langItem] = false;
                                }

                                cb(newActive);
                            }
                            else {
                                cb({});
                            }
                        }
                    });
                }
            }
            else {
                var newActive = {};
                extend(true, newActive, node.active);
                for (var langItem in node.active) {
                    if (node.active[langItem])
                        newActive[langItem] = true;
                    else
                        newActive[langItem] = false;
                }

                cb(newActive);
            }
        }

    };

};