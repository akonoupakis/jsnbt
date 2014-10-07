var app = require('./app.js');
var dpdSync = require('dpd-sync');
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
                        data: localizedData['content'] || {},
                        meta: localizedData.meta,
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

    }

};