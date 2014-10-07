var app = require('../app.js');
var dpdSync = require('dpd-sync');
var pack = require('../package.js');
var parseUri = require('parseUri');
var languageService = require('./language.js');
var _ = require('underscore');

_.str = require('underscore.string');

var getCombinedNode = function (node, contNode) {

    var result = {};

    if (contNode) {
        _.extend(result, contNode);
        _.extend(result, result.data);
        delete result.data;
        result.ref = {};
        _.extend(result.ref, node);
        _.extend(result.ref, result.ref.data);
        delete result.ref.data;
        delete result.ref.pointer;

        if (result.ref.nodeId) {
            delete result.ref.id;
            result.ref.id = result.ref.nodeId;
            delete result.ref.nodeId;
        }
    }
    else {
        _.extend(result, node);
        _.extend(result, result.data);
        delete result.data;
    }

    if (result.nodeId) {
        delete result.id;
        result.id = result.nodeId;
        delete result.nodeId;
    }

    return result;
};

var getPatchedNode = function (node) {
    var result = null;

    if (node) {
        var activeLanguages = languageService.getActive();

        if (node.domain != 'core') {

            var pointerNodes = dpdSync.call(app.dpd.nodeurls.get, {
                domain: 'core',
                entity: 'pointer',
                language: node.language,
                active: true,
                "data.nodeId": {
                    $in: node.hierarchy
                }
            });

            var pointerNode = _.first(pointerNodes);
            if (!pointerNode) {
                throw new Error('pointer not found for nodeId: ' + node.nodeId);
            }
            
            result = getCombinedNode(pointerNode, node);
        }
        else {
            result = getCombinedNode(node);
        }

        var fullUrl = '';

        if (activeLanguages.length > 1) {
            fullUrl += '/';
            if (result.ref) {
                fullUrl += result.ref.language;
            }
            else {
                fullUrl += result.language;
            }
        }

        if (result.ref) {
            fullUrl += result.ref.url;
            
            fullUrl += '/' + _.str.trim(result.url, '/').split('/').slice(1).join('/');
            if (!_.str.endsWith(fullUrl, '/'))
                fullUrl += '/';
        }
        else {
            fullUrl += result.url;
        }

        result.fullUrl = fullUrl;
    }

    return result;
};

var routers = [];

for (var i = 0; i < app.packages.length; i++) {
    var pck = app.packages[i];
    if (typeof (pck.route) === 'function') {
        routers.push(pck);
    }
}

module.exports = {

    getById: function (id, language) {
        if (!id)
            throw new Error('id is required');

        if (language) {
            var node = _.first(dpdSync.call(app.dpd.nodeurls.get, { nodeId: id, language: language, active: true }));
            return getPatchedNode(node);
        }
        else {
            var nodes = dpdSync.call(app.dpd.nodeurls.get, { nodeId: id, active: true });
            var results = [];
            for (var i = 0; i < nodes.length; i++) {
                results.push(getPatchedNode(nodes[i]));
            }
            return results;
        }
    },

    getByCode: function (domain, code, language) {
        if (!domain)
            throw new Error('domain is required');

        if (!code)
            throw new Error('code is required');

        if (language) {
            var node = _.first(dpdSync.call(app.dpd.nodeurls.get, { domain: domain, code: code, language: language, active: true }));
            return getPatchedNode(node);
        }
        else {
            var nodes = dpdSync.call(app.dpd.nodeurls.get, { domain: domain, code: code, active: true });
            var results = [];
            for (var i = 0; i < nodes.length; i++) {
                results.push(getPatchedNode(nodes[i]));
            }
            return results;
        }
    },

    getByParent: function (parentId, language) {
        if (!parentId)
            throw new Error('parentId is required');

        if (!language)
            throw new Error('language is required');

        var nodes = dpdSync.call(app.dpd.nodeurls.get, { parent: parentId, language: language, active: true });
        var results = [];
        for (var i = 0; i < nodes.length; i++) {
            results.push(getPatchedNode(nodes[i]));
        }

        return results;
    },

    getByParents: function (parentIds, language) {
        if (!parentId)
            throw new Error('parentId is required');

        if (!language)
            throw new Error('language is required');

        var nodes = dpdSync.call(app.dpd.nodeurls.get, { hierarchy: { $in: parentIds }, language: language, active: true });
        var results = [];
        for (var i = 0; i < nodes.length; i++) {
            results.push(getPatchedNode(nodes[i]));
        }

        return results;
    },

    getByUrl: function (url) {
        if (!url)
            throw new Error('url is required');
        
        var self = this;

        var uri = parseUri(url);
        uri.path = uri.path.toLowerCase();

        console.log(0);
        var defaultLanguage = languageService.getDefault();
        console.log(1);
        var activeLanguages = languageService.getActive();

        var languagePart = '';
        var urlPart = '';
        
        if (uri.path === '/') {
            languagePart = defaultLanguage;
            urlPart = uri.path;

            var settingNode = _.first(dpdSync.call(app.dpd.settings.get, { domain: 'core' }));
            if (settingNode && settingNode.data && settingNode.data.homepage) {
                var resolved = _.first(dpdSync.call(app.dpd.nodeurls.get, { nodeId: settingNode.data.homepage, language: defaultLanguage, active: true }));
                if (resolved) {
                    urlPart = resolved.url;
                }
            }
        }
        else if (activeLanguages.length > 0) {
            if (activeLanguages.length == 1) {
                languagePart = defaultLanguage;
                urlPart = uri.path;
            }
            else if (activeLanguages.length > 1) {
                var parts = _.str.trim(uri.path, '/').split('/');
                var firstPart = _.first(parts);
                if (activeLanguages.indexOf(firstPart.toLowerCase()) != -1) {
                    languagePart = firstPart.toLowerCase();
                    urlPart = '/' + parts.slice(1).join('/');
                }
            }
        }

        var fullUrlPart = urlPart + (uri.query !== '' ? '?' + uri.query : '');

        var node = null;

        var fullyMatched = _.first(dpdSync.call(app.dpd.nodeurls.get, { url: urlPart, language: languagePart, domain: 'core', active: true }));
        if (fullyMatched) {
            if (fullyMatched.pointer) {
                var pointedNode = _.first(dpdSync.call(app.dpd.nodeurls.get, { nodeId: fullyMatched.data.nodeId, language: languagePart, domain: fullyMatched.data.domain, active: true }));
                if (!pointedNode)
                    throw new Error('pointed not found for nodeId: ' + fullyMatched.id);

                for (var i = 0; i < routers.length; i++) {
                    var fmRouter = routers[i];
                    var fmAddonNode = fmRouter.resolve(fullyMatched, pointedNode, fullUrlPart);
                    if (fmAddonNode) {

                        node = getCombinedNode(fullyMatched, fmAddonNode);
                        break;
                    }
                }
            }
            else {
                node = getCombinedNode(fullyMatched);
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

                            node = getCombinedNode(matchedPointerNode, addonNode);
                            break;
                        }
                    }
                }
            }
        }
        
        if (node)
            node.fullUrl = url;

        return node;
    }

};