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

var getNonLocalizedNodeUrl = function (url) {

};

var getLocalizedNodeUrl = function (url) {
    var self = this;

    var resolved = {
        node: undefined,
        pointer: undefined
    };

    var uri = parseUri(url);
    uri.path = uri.path.toLowerCase();
    

    var languagePart = '';
    var urlPart = '';

    var defaultLanguage = getDefaultLanguage();
    var activeLanguages = getActiveLanguages();

    if (uri.path === '/') {
        languagePart = defaultLanguage;
        urlPart = uri.path;

        var settingNode = _.first(dpdSync.call(app.dpd.settings.get, { domain: 'core' }));
        if (settingNode && settingNode.data && settingNode.data.homepage) {
            var resolved = _.first(dpdSync.call(app.dpd.nodeurls.get, { nodeId: settingNode.data.homepage, language: defaultLanguage }));
            if (resolved) {
                urlPart = resolved.url;
            }
        }
    }
    else {
        if (activeLanguages.length > 1) {
            var parts = _.str.trim(uri.path, '/').split('/');
            var firstPart = _.first(parts);
            if (activeLanguages.indexOf(firstPart.toLowerCase()) != -1) {
                languagePart = firstPart.toLowerCase();
                urlPart = '/' + parts.slice(1).join('/');
            }
        }
        //else {
        //    languagePart = 'en';
        //    urlPart = urlPart;
        //}
    }

    var fullUrlPart = urlPart + (uri.query !== '' ? '?' + uri.query : '');
    
    var matchedNodeUrls = dpdSync.call(app.dpd.nodeurls.get, { url: urlPart, domain: 'core' });

    var matchedNodeUrl = _.first(_.filter(matchedNodeUrls, function (x) { return x.language === languagePart; }));
    if (matchedNodeUrl === undefined) {
        var matchedNodeUrl = _.first(_.filter(matchedNodeUrls, function (x) { return x.language === 'en' && x.localization.enabled === false; }));
    }
    
    if (matchedNodeUrl) {
        if (matchedNodeUrl.entity === 'pointer') {
            var pointedNodeUrls = dpdSync.call(app.dpd.nodeurls.get, { nodeId: matchedNodeUrl.pointer.nodeId, domain: matchedNodeUrl.pointer.domain });
            var pointedNodeUrl = _.first(_.filter(pointedNodeUrls, function (x) { return x.language === matchedNodeUrl.language; }));
            if (pointedNodeUrl === undefined) {
                var pointedNodeUrl = _.first(_.filter(pointedNodeUrls, function (x) { return x.language === 'en' && x.localization.enabled === false; }));
            }
            
            if (pointedNodeUrl) {
                return {
                    node: pointedNodeUrl,
                    pointer: matchedNodeUrl,
                    view: pointedNodeUrl.view,
                    language: pointedNodeUrl.language
                };
            }
            else {
                return {
                    node: matchedNodeUrl,
                    view: matchedNodeUrl.view,
                    language: matchedNodeUrl.language
                };
            }
        }
        else {
            return {
                node: matchedNodeUrl,
                view: matchedNodeUrl.view,
                language: matchedNodeUrl.language
            };
        }
    }
    else {
        var pointerNodes = dpdSync.call(app.dpd.nodeurls.get, {
            domain: 'core',
            entity: 'pointer',
            language: languagePart
        });
        if (pointerNodes.length > 0) {
            var sortedPointerNodes = _.sortBy(pointerNodes, function (pointerNode) { return Math.sin(pointerNode.url.length); });

            var matchedPointerNode = _.first(_.filter(pointerNodes, function (x) { return _.str.startsWith(urlPart, x.url + '/'); }));
            
            if (matchedPointerNode) {
                var matchedPointedNode = _.first(dpdSync.call(app.dpd.nodeurls.get, { nodeId: matchedPointerNode.pointer.nodeId, language: languagePart, domain: matchedPointerNode.pointer.domain }));

                if (matchedPointedNode) {
                    for (var p = 0; p < app.packages.length; p++) {
                        var pack = app.packages[p];

                        if (typeof (pack.route) === 'function' && typeof (pack.resolve) === 'function') {
                            var addonNode = pack.resolve(matchedPointerNode, matchedPointedNode, fullUrlPart);
                            if (addonNode) {
                                return {
                                    node: addonNode,
                                    pointer: matchedPointerNode,
                                    view: addonNode.view,
                                    language: addonNode.language
                                }
                            }
                        }
                    }
                }
            }
        }

        return undefined;
    }

    //resolved.node = matchedNodeUrl;
    /*
    if (fullyMatched) {
        if (fullyMatched.pointer) {
            var pointedNode = _.first(dpdSync.call(app.dpd.nodeurls.get, { nodeId: fullyMatched.data.nodeId, language: languagePart, domain: fullyMatched.data.domain, active: true }));
            if (!pointedNode)
                throw new Error('pointed not found for nodeId: ' + fullyMatched.id);

            for (var i = 0; i < routers.length; i++) {
                var fmRouter = routers[i];
                var fmAddonNode = fmRouter.resolve(fullyMatched, pointedNode, fullUrlPart);
                if (fmAddonNode) {

                    node = getFinalizedNode(fullyMatched, fmAddonNode);
                    break;
                }
            }
        }
        else {
            node = getFinalizedNode(fullyMatched);
        }
    }
    else {
        var pointerNodes = dpdSync.call(app.dpd.nodeurls.get, {
            domain: 'core',
            entity: 'pointer',
            language: languagePart
        });
        if (pointerNodes.length > 0) {
            var sortedPointerNodes = _.sortBy(pointerNodes, function (pointerNode) { return Math.sin(pointerNode.url.length); });

            var matchedPointerNode = null;

            for (var s = 0; s < sortedPointerNodes.length; s++) {
                var pointerNode = sortedPointerNodes[s];

                var starts = _.str.startsWith(urlPart, pointerNode.url + '/');
                if (starts) {
                    matchedPointerNode = pointerNode;
                    break;
                }
            }

            if (matchedPointerNode) {
                var matchedPointedNode = _.first(dpdSync.call(app.dpd.nodeurls.get, { nodeId: matchedPointerNode.data.nodeId, language: languagePart, domain: matchedPointerNode.data.domain, active: true }));

                if (!matchedPointedNode)
                    throw new Error('pointed not found for nodeId: ' + matchedPointerNode.id);

                for (var ii = 0; ii < routers.length; ii++) {
                    var router = routers[ii];
                    var addonNode = router.resolve(matchedPointerNode, matchedPointedNode, fullUrlPart);
                    if (addonNode) {

                        node = getFinalizedNode(matchedPointerNode, addonNode);
                        break;
                    }
                }
            }
        }
    }

    if (node)
        node.fullUrl = url;
    */


    return {
        node: undefined,
        pointer: undefined
    };
};

module.exports = {

    getHierarchy: function (node) {
        var hierarchyNodes = getHierarchyNodes(node);

        var hierarchyNodeIds = _.pluck(hierarchyNodes, 'id');

        return hierarchyNodeIds;
    },

    materialize: function (node) {
        var existingNodeUrls = dpdSync.call(app.dpd.nodeurls.get, { nodeId: node.id });

        var currentLanguages = [];
        for (var lang in node.data.localized) {
            currentLanguages.push(lang);
        }

        var languagesToDelete = [];
        _.each(existingNodeUrls, function (existingNodeUrl) {
            if (currentLanguages.indexOf(existingNodeUrl.language) == -1)
                languagesToDelete.push(existingNodeUrl.language);
        });

        var hierarchyNodes = getHierarchyNodes(node);

        for (var lang in node.data.localized) {            
            var localizedData = node.data.localized[lang];
            if (localizedData.active) {

                var urlValid = true;

                var urlParts = [];
                _.each(hierarchyNodes, function (hierarchyNode) { 
                    if (hierarchyNode.data.localized[lang])
                        urlParts.push(hierarchyNode.data.localized[lang].seoName);
                    else
                        urlValid = false;
                });

                if (urlValid) {

                    var permissions = ['public'];
                    _.each(hierarchyNodes, function (hierarchyNode) {
                        if (!hierarchyNode.permissions.inherits)
                            permissions = hierarchyNode.permissions.roles.slice(0);
                    });

                    var nodeUrl = {
                        nodeId: node.id,
                        language: lang,
                        code: node.code,
                        domain: node.domain,
                        entity: node.entity,
                        url: '/' + urlParts.join('/'),
                        secure: node.secure,
                        hierarchy: node.hierarchy,
                        view: node.view,
                        pointer: node.entity === 'pointer' ? node.pointer : {},
                        data: node.entity !== 'pointer' ? localizedData['content'] || {} : {},
                        meta: localizedData.meta,
                        localization: node.localization,
                        permissions: permissions
                    };

                    var existedNodeUrl = _.first(_.filter(existingNodeUrls, function (x) { return x.language === lang; }));
                    if (existedNodeUrl) {
                        dpdSync.call(app.dpd.nodeurls.put, existedNodeUrl.id, nodeUrl);
                    }
                    else {
                        dpdSync.call(app.dpd.nodeurls.post, nodeUrl);
                    }
                }

            }
        }

        _.each(languagesToDelete, function (languageToDelete) { 
            var nodeUrlToDelete = _.first(_.filter(existingNodeUrls, function (x) { return x.language === languageToDelete; }));
            if (nodeUrlToDelete)
                dpdSync.call(app.dpd.nodeurls.del, nodeUrlToDelete.id);
        });

    },

    getNodeUrl: function (url) {
        if (!url)
            throw new Error('url is required');

        if (jsnbt.localization) {
            return getLocalizedNodeUrl(url);
        }
        else {
            return getNonLocalizedNodeUrl(url);
        }
    }

};