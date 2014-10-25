var app = require('./app.js');
var jsnbt = require('./jsnbt.js');
var dpdSync = require('dpd-sync');
var parseUri = require('parseUri');
var _ = require('underscore');

_.str = require('underscore.string');

var clone = function (obj) {
    var newObj = obj;
    _.extend(newObj, obj);
    return newObj;
}

var getHierarchyNodes = function (node) {
    
    var nodes = [];

    var current = clone(node);
    
    while (current !== null) {
        nodes.push(current);
        
        if (current.parent && current.parent !== '') {
            var parentNode = dpdSync.call(app.dpd.nodes.get, current.parent);
            if (parentNode)
                current = clone(parentNode);
            else
                current = null;
        }
        else {
            current = null;
        }
    }
    
    nodes.reverse();

    return nodes;

};

var getActiveLanguages = function () {
    var dbLanguages = dpdSync.call(app.dpd.languages.get, { active: true });
    return _.pluck(dbLanguages, 'code');
};

var getDefaultLanguage = function () {
    var defaultLanguage = 'en';

    var dbDefaultLanguages = dpdSync.call(app.dpd.languages.get, { active: true, "default": true });
    if (dbDefaultLanguages.length > 0)
        defaultLanguage = _.first(dbDefaultLanguages).code;

    return defaultLanguage;
};

var resolvePointerUrl = function (returnObj, seoNodes, urlPath, url) {
    var pointedNode = dpdSync.call(app.dpd.nodes.get, { id: returnObj.pointer.pointer.nodeId, domain: returnObj.pointer.pointer.domain });
    if (!pointedNode)
        return;

    //var pack = _.first(_.filter(app.packages, function (x) { return x.domain === pointedNode.domain && typeof (x.resolve) === 'function'; }));
    //if (pack) {
    //    var addonNode = pack.resolve({
    //        pointer: matchedNode,
    //        pointed: pointedNode,
    //        nodes: foundNodes,
    //        url: url
    //    });
    //    if (addonNode) {
    //        return {
    //            node: addonNode,
    //            pointer: matchedNode,
    //            view: addonNode.view,
    //            language: language
    //        }
    //    }
    //}

    var pointedSeoNames = _.str.trim(urlPath, '/') !== '' ? _.str.trim(urlPath, '/').split('/') : [];
    if (pointedSeoNames.length === 0) {
        returnObj.page = pointedNode;
        returnObj.view = pointedNode.view;
        returnObj.nodes = _.union(returnObj.nodes, pointedNode);
        return returnObj;
    }

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
            return returnObj;
        }
    }
};

module.exports = {

    cache: {
        
        id2url: {

        },

        url2id: {

        },

        purge: function () {

            console.log('purge cache');

        }

    },

    getHierarchy: function (node) {
        var hierarchyNodes = getHierarchyNodes(node);

        var hierarchyNodeIds = _.pluck(hierarchyNodes, 'id');

        return hierarchyNodeIds;
    },

    resolveUrl: function (url) {
        if (!url)
            throw new Error('url is required');

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

        var defaultLanguage = jsnbt.localization ? getDefaultLanguage() : 'en';
        
        if (uri.path === '/') {
            var languagePart = defaultLanguage;
            var urlPart = uri.path;

            var settingNode = _.first(dpdSync.call(app.dpd.settings.get, { domain: 'core' }));
            if (settingNode && settingNode.data && settingNode.data.homepage) {

                var resolved = dpdSync.call(app.dpd.nodes.get, settingNode.data.homepage);
                if (resolved) {
                    var resolvedHierarchy = dpdSync.call(app.dpd.nodes.get, { hierarchy: resolved.hierarchy });
                    var resolvedNodes = [];
                    _.each(resolved.hierarchy, function (rh) {
                        var resolvedNode = _.first(_.filter(resolvedHierarchy, function (x) { return x.id === rh; }));
                        if (resolvedNode)
                            resolvedNodes.push(resolvedNode);
                    });

                    returnObj.page = resolved;
                    returnObj.nodes = resolvedNodes;
                    returnObj.language = defaultLanguage;
                    returnObj.view = resolved.view;

                    return returnObj;
                }
            }
        }
        else {
            if (jsnbt.localization) {
                var activeLanguages = jsnbt.localization ? getActiveLanguages() : ['en'];
                if (activeLanguages.length > 0) {
                    var parts = _.str.trim(uri.path, '/').split('/');
                    var firstPart = _.first(parts);
                    if (activeLanguages.indexOf(firstPart.toLowerCase()) != -1) {
                        languagePart = firstPart.toLowerCase();
                        urlPart = '/' + parts.slice(1).join('/');
                    }
                }
            }
            else {
                languagePart = 'en';
                urlPart = _.str.rtrim(uri.path, '/');
            }
        }

        if (!languagePart)
            return;
        
        var seoNames = _.str.trim(urlPart, '/').split('/');

        var seoNamesQuery = {};
        seoNamesQuery['url.' + (jsnbt.localization ? languagePart : 'en')] = { $in: seoNames };

        var urlSeoNodes = dpdSync.call(app.dpd.nodes.get, seoNamesQuery);

        var loopParentId = '';
        var foundNodes = [];
        var foundAllMatches = true;
        var buildUrl = '';

        _.each(seoNames, function (seoName) {
            var matchedSeoNode = _.first(_.filter(urlSeoNodes, function (x) {
                return x.url[jsnbt.localization ? languagePart : 'en'].toLowerCase() === seoName.toLowerCase() &&
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
                returnObj.language = languagePart;
                returnObj.nodes = foundNodes;
                returnObj.pointer = matchedNode;
                return resolvePointerUrl(returnObj, urlSeoNodes, '/', '/' + (uri.query !== '' ? '?' + uri.query : ''));
            }
            else {
                returnObj.page = matchedNode;
                returnObj.nodes = foundNodes;
                returnObj.language = languagePart;
                returnObj.view = matchedNode.view;
                return returnObj;
            }
        }
        else {
            var pointerNode = _.last(foundNodes);
            if (pointerNode && pointerNode.entity === 'pointer') {
                var trimmedUrl = urlPart.length > buildUrl.length ? urlPart.substring(buildUrl.length) : '';
                if (trimmedUrl === '')
                    trimmedUrl = '/';

                var fullUrlPart = trimmedUrl + (uri.query !== '' ? '?' + uri.query : '');

                returnObj.language = languagePart;
                returnObj.nodes = foundNodes;
                returnObj.pointer = pointerNode;
                return resolvePointerUrl(returnObj, urlSeoNodes, trimmedUrl, fullUrlPart);
            }
        }
    },

    getUrl: function (node) {
        var hierarchyNodes = dpdSync.call(app.dpd.nodes.get, { id: { $in: node.hierarchy } });

        var resolved = {};

        for (var langItem in node.url) {

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
                resolved[langItem] = langUrl;
            }
        }

        return resolved;
    },

    isLocalized: function (entity) {
        var jsnbtEntity = _.first(_.filter(jsnbt.entities, function (x) { return x.name === entity; }));
        if (jsnbtEntity) {
            return jsnbtEntity.localized === undefined || jsnbtEntity.localized === true;
        }
        else {
            return false;
        }
    }
};