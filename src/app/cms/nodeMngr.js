var parseUri = require('parseUri');
var extend = require('extend');
var _ = require('underscore');

_.str = require('underscore.string');

var getHomePage = function (server, cb) {

    var settingsStore = server.db.createStore('settings');
    settingsStore.get(function (x) {
        x.query({
            domain: 'core'
        });
        x.single();
        x.cached();
    }, function (err, settings) {
        if (err)
            return cb(err);

        if (settings && settings.data && settings.data.homepage) {
            var nodesStore = server.db.createStore('nodes');
            nodesStore.get(function (x) {
                x.query(settings.data.homepage);
            }, function (nodeErr, node) {
                cb(nodeErr, node);
            });
        }
        else {
            cb();
        }
    });

};

var resolveUrl = function (server, returnObj, language, url, query, cb) {

    var seoNames = _.str.trim(url, '/').split('/');

    var seoNamesQuery = {};
    seoNamesQuery['seo.' + (server.app.localization.enabled ? language : server.app.localization.locale)] = { $in: seoNames };

    var nodesStore = server.db.createStore('nodes');
    nodesStore.get(function (x) {
        x.query(seoNamesQuery);
    }, function (urlSeoNodesError, urlSeoNodes) {
        if (urlSeoNodesError)
            return cb(urlSeoNodesError);

        var loopParentId = '';
        var foundNodes = [];
        var foundAllMatches = true;
        var buildUrl = '';

        _.each(seoNames, function (seoName) {
            var matchedSeoNode = _.find(urlSeoNodes, function (x) {
                return x.seo[server.app.localization.enabled ? language : server.app.localization.locale].toLowerCase() === seoName.toLowerCase() &&
                    x.parent === loopParentId &&
                    x.domain === 'core';
            });
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
                returnObj.page = returnObj.pointed;
                resolvePointerUrl(server, returnObj, urlSeoNodes, '/', '/' + query, cb);
            }
            else {
                returnObj.page = matchedNode;

                if (matchedNode.entity === 'router') {
                    returnObj.route = matchedNode.route;
                }

                returnObj.nodes = foundNodes;
                returnObj.language = language;
                returnObj.template = matchedNode.template;
                returnObj.url = '/';
                cb(null, returnObj);
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
                resolvePointerUrl(server, returnObj, urlSeoNodes, trimmedUrl, fullUrlPart, cb);
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
                returnObj.url = fullUrlPart;
                cb(null, returnObj);
            }
            else {
                cb();
            }
        }
    });
};

var resolvePointerUrl = function (server, returnObj, seoNodes, urlPath, url, cb) {

    var nodesStore = server.db.createStore('nodes');
    nodesStore.get(function (x) {
        x.query({
            id: returnObj.pointer.pointer.nodeId,
            domain: returnObj.pointer.pointer.domain
        });
        x.single();
    }, function (pointedNodeError, pointedNode) {
        if (pointedNodeError)
            return cb(pointedNodeError);

        if (!pointedNode)
            return cb(new Error('pointed node not found'));
        
        var pointedSeoNames = _.str.trim(urlPath, '/') !== '' ? _.str.trim(urlPath, '/').split('/') : [];
        var pack = _.find(server.app.modules.rest, function (x) {
            return x.domain === pointedNode.domain
                && x.url && _.isObject(x.url) && _.isFunction(x.url.resolve);
        });

        var pointedLoopParentId = pointedNode.id;
        var pointedFoundNodes = [pointedNode];
        var pointedFoundAllMatches = true;

        _.each(pointedSeoNames, function (pointedSeoName) {
            var matchedPointedSeoNode = _.find(seoNodes, function (x) {
                return x.seo[server.app.localization.enabled ? returnObj.language : server.app.localization.locale].toLowerCase() === pointedSeoName.toLowerCase() &&
                    x.parent === pointedLoopParentId &&
                    x.domain === pointedNode.domain;
            });

            if (matchedPointedSeoNode) {
                pointedFoundNodes.push(matchedPointedSeoNode);
                pointedLoopParentId = matchedPointedSeoNode.id;
            }
            else {
                pointedFoundAllMatches = false;
                return false;
            }
        });

        var targetMatchedNode = undefined;

        if (pointedFoundAllMatches)
            targetMatchedNode = _.last(pointedFoundNodes);

        if (pack) {
            returnObj.seoNames = pointedSeoNames;
            returnObj.pointed = pointedNode;

            if (pointedSeoNames.length === 0) {
                returnObj.nodes = seoNodes;
                returnObj.page = pointedNode;
                returnObj.template = pointedNode.template;
                _.each(pointedFoundNodes, function (pointedFoundNode) {
                    returnObj.nodes.push(pointedFoundNode);
                });
            }
            else {
                if (targetMatchedNode) {
                    returnObj.page = targetMatchedNode;
                    returnObj.template = targetMatchedNode.template;
                    _.each(pointedFoundNodes, function (pointedFoundNode) {
                        returnObj.nodes.push(pointedFoundNode);
                    });
                }
            }

            pack.url.resolve(server, returnObj, function () {
                cb(null, returnObj);
            });
        }
        else {
            if (pointedSeoNames.length === 0) {
                returnObj.page = pointedNode;
                returnObj.template = pointedNode.template;
                returnObj.nodes.push(pointedNode);
                cb(null, returnObj);
            }
            else {

                if (targetMatchedNode) {
                    returnObj.page = targetMatchedNode;
                    returnObj.template = targetMatchedNode.template;
                    _.each(pointedFoundNodes, function (pointedFoundNode) {
                        returnObj.nodes.push(pointedFoundNode);
                    });
                    cb(null, returnObj);

                }
                else {
                    cb();
                }
            }
        }
    });
};

var resolveHierarchy = function (server, nodes, node, cb) {
    if (node.parent && node.parent !== '') {
        var store = server.db.createStore('nodes');
        store.get(function (x) {
            x.query(node.parent);
            x.single();
        }, function (error, result) {
            if (error)
                return cb(error);
            
            nodes.reverse();
            nodes.push(result);
            nodes.reverse();

            resolveHierarchy(server, nodes, result, cb);
        })
    }
    else {
        cb(null, nodes);
    }
};

var NodeManager = function(server) {

    this.server = server;
    
};

NodeManager.prototype.purgeCache = function (nodeId) {
    var self = this;

    self.server.cache.getKeys('node.url', function (urlCacheErr, urlCacheKeys) {
        _.find(_.filter(urlCacheKeys, function (x) { return x.indexOf(nodeId) !== -1; }), function (key) {
            self.server.cache.purge('node.url.' + key, function (err, res) { });
        });
    });

    self.server.cache.getKeys('node.active', function (activeCacheErr, activeCacheKeys) {
        _.find(_.filter(activeCacheKeys, function (x) { return x.indexOf(nodeId) !== -1; }), function (key) {
            self.server.cache.purge('node.active.' + key, function (err, res) { });
        });
    });
}

NodeManager.prototype.resolveUrl = function (url, cb) {
    var self = this;

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
        getHierarchy: function () {
            return _.map(_.filter(this.nodes, function (y) { return y.entity !== 'pointer'; }), function (x) { return x.id; });
        },
        getInheritedProperties: function () {
            var rSelf = this;

            var inherited = {};

            if (!self.server.app.config.collections.nodes.inheritablePropertyNames) {
                var inheritablePropertyNames = [];
                var propertyKeys = _.keys(self.server.app.config.collections.nodes.schema.properties);
                _.each(propertyKeys, function (propertyKey) {
                    var prop = self.server.app.config.collections.nodes.schema.properties[propertyKey];
                    if (prop.type === 'object' && prop.inheritable === true)
                        inheritablePropertyNames.push(propertyKey);
                });
                self.server.app.config.collections.nodes.inheritablePropertyNames = inheritablePropertyNames;
            }

            _.each(self.server.app.config.collections.nodes.inheritablePropertyNames, function (inheritedName) {
                _.each(rSelf.nodes, function (rnode) {
                    if (rnode[inheritedName] && !rnode[inheritedName].inherits === true) {
                        if (rnode[inheritedName].value)
                            inherited[inheritedName] = rnode[inheritedName].value;
                    }
                });
            });

            return inherited;
        }
    };
    
    var uri = parseUri(url);
    uri.path = uri.path.toLowerCase();
    
    var localeManager = require('./localeMngr.js')(self.server);
    localeManager.getDefault(function (langErr, defaultLanguage) {
        if (langErr)
            return cb(langErr);

        if (uri.path === '/') {
            var languagePart = defaultLanguage;
            var urlPart = uri.path;

            getHomePage(self.server, function (homeNodeErr, homeNode) {
                if (homeNodeErr)
                    return cb(resolvedNodeError);
                
                if (homeNode) {
                    var nodesStore = self.server.db.createStore('nodes');
                    nodesStore.get(function (x) {
                        x.query({
                            hierarchy: homeNode.hierarchy
                        });
                    }, function (resolvedHierarchyNodesError, resolvedHierarchyNodes) {
                        if (resolvedHierarchyNodesError)
                            return cb(resolvedHierarchyNodesError);

                        var resolvedNodes = [];
                        _.each(homeNode.hierarchy, function (rh) {
                            var resolvedNode = _.find(resolvedHierarchyNodes, function (x) { return x.id === rh; });
                            if (resolvedNode)
                                resolvedNodes.push(resolvedNode);
                        });

                        returnObj.page = homeNode;

                        if (homeNode.entity === 'router') {
                            returnObj.route = homeNode.route;
                        }

                        returnObj.nodes = resolvedNodes;
                        returnObj.language = defaultLanguage;
                        returnObj.template = homeNode.template;

                        cb(null, returnObj);
                    });
                }
                else {
                    cb();
                }
            });
        }
        else {
            if (self.server.app.localization.enabled) {
                localeManager.getActive(function (activeLanguageErr, activeLanguageCodes) {
                    if (activeLanguageErr)
                        return cb(activeLanguageErr);

                    if (activeLanguageCodes.length > 0) {
                        var parts = _.str.trim(uri.path, '/').split('/');
                        var firstPart = _.first(parts);
                        if (activeLanguageCodes.indexOf(firstPart.toLowerCase()) !== -1) {
                            languagePart = firstPart.toLowerCase();
                            urlPart = '/' + parts.slice(1).join('/');

                            resolveUrl(self.server, returnObj, languagePart, urlPart, (uri.query !== '' ? '?' + uri.query : ''), cb);
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
                languagePart = self.server.app.localization.locale;
                urlPart = _.str.rtrim(uri.path, '/');

                resolveUrl(self.server, returnObj, languagePart, urlPart, (uri.query !== '' ? '?' + uri.query : ''), cb);
            }
        }

    });
};

NodeManager.prototype.getUrl = function (node, cb) {
    var self = this;
    
    var parentHierarchy = [];
    if (node.parent !== '' && node.hierarchy.length > 1) {
        parentHierarchy = node.hierarchy.slice(0);
        parentHierarchy.pop();
    }
            
    if (parentHierarchy.length > 0) {
        var parentCacheKey = parentHierarchy.join('-');
        
        self.server.cache.get('node.url.' + parentCacheKey, function (parentCachedErr, parentCachedValue) {
            if (parentCachedErr)
                return cb(parentCachedErr);

            if (parentCachedValue) {                        
                var newUrl = {};
                extend(true, newUrl, parentCachedValue);

                var pack = _.find(self.server.app.modules.all, function (x) {
                    return x.domain === node.domain
                          && _.isObject(x.url) && _.isFunction(x.url.build);
                });

                if (pack) {

                    for (var item in node.seo) {
                        if (!newUrl[item])
                            newUrl[item] = '';
                    }
                            
                    pack.url.build(self.server, {
                        node: node,
                        url: newUrl
                    }, function () {
                        cb(null, newUrl);
                    });

                }
                else {
                          
                    for (var langItem in node.seo) {
                        var seoName = node.seo[langItem];
                        if (parentCachedValue[langItem]) {
                            newUrl[langItem] = parentCachedValue[langItem] + '/' + seoName
                        }
                        else {
                            delete newUrl[langItem];
                        }
                    }

                    cb(null, newUrl);
                }
            }
            else {
                
                var nodesStore = self.server.db.createStore('nodes');
                nodesStore.get(function (x) {
                    x.query({
                        id: { $in: parentHierarchy }
                    });
                }, function (error, results) {
                    if (error)
                        return cb(error);

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

                        var lastNode = _.last(hierarchyNodes);

                        extend(true, parentUrl, lastNode.seo);
                        
                        var entity = self.getEntity(node.entity);
                        var urlKeys = entity.isSeoNamed() ? node.seo : lastNode.seo;

                        for (var langItem in urlKeys) {
                            var langUrl = '';
                            var fullyResolved = true;
                            if (_.filter(self.server.app.languages, function (x) { return x.code === langItem; }).length > 0) {
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
                                if (lastNode.domain === 'core' && self.server.app.localization.enabled && getEntity(lastNode.entity).isLocalized()) {
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

                        self.server.cache.add('node.url.' + parentCacheKey, parentUrl, function (parentCachedErr, parentCachedValue) {
                            if (parentCachedErr)
                                return cb(parentCachedErr);

                            var pack = _.find(self.server.app.modules.all, function (x) {
                                return x.domain === node.domain
                                        && _.isObject(x.url) && _.isFunction(x.url.build);
                            });
                            if (pack) {
                                extend(true, newUrl, parentUrl);

                                for (var item in node.seo) {
                                    if (!newUrl[item])
                                        newUrl[item] = '';
                                }

                                pack.url.build(self.server, {
                                    node: node,
                                    url: newUrl
                                }, function () {
                                    cb(null, newUrl);
                                });
                            }
                            else {
                                extend(true, newUrl, node.seo);
                                for (var langItem in node.seo) {
                                    if (parentUrl[langItem])
                                        newUrl[langItem] = parentUrl[langItem] + '/' + node.seo[langItem];
                                    else
                                        delete newUrl[langItem];
                                }

                                cb(null, newUrl);
                            }

                        });
                    }
                    else {
                        cb(null, {});
                    }
                });
            }

        });
    }
    else {
        var pack = _.find(self.server.app.modules.rest, function (x) { return x.domain === node.domain && _.isObject(x.url) && typeof (x.url.build) === 'function'; });
        if (pack) {

            var newUrl = {};
            for (var item in node.seo) {
                if (!newUrl[item])
                    newUrl[item] = '';
            }

            pack.url.build(self.server, {
                node: node,
                url: newUrl
            }, function () {
                cb(null, newUrl);
            });
        }
        else {
            var newUrl = {};
            extend(true, newUrl, node.seo);
            for (var langItem in node.seo) {
                var seoName = node.seo[langItem];
                var resolvedLangUrl = '';
                if (node.domain === 'core' && self.server.app.localization.enabled) {
                    var entity = self.getEntity(node.entity);
                    if (entity.isLocalized())
                        resolvedLangUrl += '/' + langItem;
                }
                resolvedLangUrl += '/' + seoName;
                newUrl[langItem] = resolvedLangUrl;
            }

            cb(null, newUrl);
        }
    }
};

NodeManager.prototype.getEnabled = function (node, cb) {
    var self = this;
    
    var parentHierarchy = [];
    if (node.parent !== '' && node.hierarchy.length > 1) {
        parentHierarchy = node.hierarchy.slice(0);
        parentHierarchy.pop();
    }

    if (parentHierarchy.length > 0) {
        var parentCacheKey = parentHierarchy.join('-');

        self.server.cache.get('node.active.' + parentCacheKey, function (parentCachedErr, parentCachedValue) {
            if (parentCachedErr)
                return cb(parentCachedErr);

            if (parentCachedValue) {
                var newValue = {};
                extend(true, newValue, node.active);
                for (var langItem in node.active) {
                    if (parentCachedValue[langItem] && node.active[langItem]) {
                        newValue[langItem] = true;
                    }
                    else {
                        newValue[langItem] = false;
                    }
                }

                cb(null, newValue);
            }
            else {
                var nodesStore = self.server.db.createStore('nodes');
                nodesStore.get(function (x) {
                    x.query({
                        id: { $in: parentHierarchy }
                    });
                }, function (error, results) {
                    if (error)
                        return cb(error);

                    var hierarchyNodes = [];
                    var allHierarchyNodes = true;

                    _.each(parentHierarchy, function (selfHierarchy) {
                        var hNode = _.find(results, function (x) { return x.id == selfHierarchy; });
                        if (hNode)
                            hierarchyNodes.push(hNode);
                        else {
                            allHierarchyNodes = false;
                            return false;
                        }
                    });

                    if (allHierarchyNodes) {
                        var parentActive = {};

                        var lastNode = _.last(hierarchyNodes);

                        extend(true, parentActive, lastNode.active);

                        for (var langItem in lastNode.active) {
                            var langActive = true;
                            if (_.filter(self.server.app.languages, function (x) { return x.code === langItem; }).length > 0) {
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

                        self.server.cache.add('node.active.' + parentCacheKey, parentActive, function (parentCachedErr, parentCachedValue) {
                            if (parentCachedErr)
                                return cb(parentCachedErr);

                            extend(true, newActive, node.active);
                            for (var langItem in node.active) {
                                if (parentActive[langItem] && node.active[langItem])
                                    newActive[langItem] = true;
                                else
                                    newActive[langItem] = false;
                            }

                            cb(null, newActive);
                        });
                    }
                    else {
                        cb(null, {});
                    }
                });
            }

        });
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

        cb(null, newActive);
    }
};

NodeManager.prototype.getHierarchy = function (node, cb) {
    resolveHierarchy(this.server, [node], node, cb);
};

NodeManager.prototype.getEntity = function (name) {
    var entity = _.find(this.server.app.config.entities, function (x) { return x.name === name; });;

    if (!entity) {
        return {
            isLocalized: function () { return false },
            hasProperty: function () { return false },
            isSeoNamed: function () { return false }
        };
    }
    else {
        return {

            isLocalized: function () {

                return entity.localized === undefined || entity.localized === true;

            },

            hasProperty: function (property) {

                return entity.properties[property] === undefined || entity.properties[property] === true;

            },

            isSeoNamed: function () {

                return this.hasProperty('seo');

            }

        }
    }
};

module.exports = function (server) {
    return new NodeManager(server);
};