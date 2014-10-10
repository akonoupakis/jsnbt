var app = require('../app.js');
var dpdSync = require('dpd-sync');
var _ = require('underscore');

_.str = require('underscore.string');

var getFinalizedNode = function (node) {

    var result = {};

    _.extend(result, node);
    _.extend(result, result.data);
    delete result.data;
    
    if (result.nodeId) {
        delete result.id;
        result.id = result.nodeId;
        delete result.nodeId;
    }

    return result;
};

var getPatchedNodes = function (user, draft, nodes) {
    var results = [];

    if (nodes.length > 0) {

        var nodeIds = _.pluck(nodes, 'nodeId');

        var draftNodes = [];

        if (draft) {
            if (user)
                draftNodes = dpdSync.call(app.dpd.drafts.get, { refId: { $in: nodeIds }, user: user.id, collection: 'nodes' });
        }
        
        _.each(nodes, function (node) {
            var result = {};
            _.extend(result, node);
        
            var draftNode = _.first(_.filter(draftNodes, function (x) { return x.refId === node.nodeId; }));
            if (draftNode && draftNode.data.data && draftNode.data.data.localized[node.language]) {
                result.data = draftNode.data.data.localized[node.language].content || {};
                result.meta = draftNode.data.data.localized[node.language].meta;
            }

            results.push(getFinalizedNode(result));
        });
    }

    return results;
};

var getNodeResults = function (nodeUrls) {
    var results = [];

    _.each(nodeUrls, function (nodeUrl) {

        var result = {};

        _.extend(result, nodeUrl);
        _.extend(result, result.data);
        delete result.data;

        if (result.nodeId) {
            delete result.id;
            result.id = result.nodeId;
            delete result.nodeId;
        }

        results.push(result);
    });

    return results;
};

var getNodeDraftResults = function (language, nodes, drafts) {
    var results = [];

    _.each(nodes, function (node) {

        var loopNode = node;
        
        var draft = _.first(_.filter(drafts, function (x) { return x.refId === node.id; }));
        if (draft) {
            loopNode = draft.data;

            if (draft.data.parent !== node.parent) {
                // re-calculate hierarchy and set to loopNode
            }
        }

        var result = {
            domain: loopNode.domain,
            entity: loopNode.entity,
            hierarchy: loopNode.hierarchy,
            id: loopNode.id,
            language: language,
            meta: {},
            secure: loopNode.secure,
            url: '/jsnbt-preview/' + language + '-' + loopNode.id,
            view: loopNode.view,
            permissions: ['admin']
        };

        if (loopNode.data && loopNode.data.localized && loopNode.data.localized[language]) {
            _.extend(result.meta, loopNode.data.localized[language].meta);
            _.extend(result, loopNode.data.localized[language].content);
        }
        
        results.push(result);
    });

    return results;
};

module.exports = {

    get: function (user, draft, options) {

        var defaults = {
            id: undefined,
            language: undefined
        };

        var opts = {};
        _.extend(opts, defaults);
        _.extend(opts, options);

        if (!opts.id)
            throw new Error('id is required');
        
        if (user && draft) {
            var requestOptions = {};

            requestOptions.id = opts.id;

            var node = dpdSync.call(app.dpd.nodes.get, requestOptions);
            if (node) {
                var drafts = dpdSync.call(app.dpd.drafts.get, { refId: { $in: [node.id] }, user: user.id, collection: 'nodes' });
                return _.first(getNodeDraftResults(opts.language, [node], drafts));
            }
            else
                return undefined;
        }
        else {
            var requestOptions = {};

            requestOptions.nodeId = opts.id;

            if (opts.language)
                requestOptions.language = opts.language;
                        
            var nodes = dpdSync.call(app.dpd.nodeurls.get, requestOptions);
            return opts.language ? _.first(getNodeResults(nodes)) : getNodeResults(nodes);
        }
    },

    getPage: function (user, draft, options) {

        var defaults = {
            parentId: undefined,
            language: undefined,
            entities: undefined,
            query: undefined,
            skip: 0,
            limit: 100
        };

        var opts = {};
        _.extend(opts, defaults);
        _.extend(opts, options);

        if (!opts.parentId)
            throw new Error('parentId is required');

        if (!opts.language)
            throw new Error('language is required');

        if (user && draft) {
            var requestOptions = {};

            requestOptions.parent = opts.parentId;
            
            if (opts.query)
                for (var item in opts.query)
                    requestOptions['data.localized.' + opts.language + '.content.' + item] = opts.query[item];
            
            if (opts.entities) {
                request.entity = {
                    $in: opts.entities
                }
            }

            requestOptions.$skip = opts.skip;
            requestOptions.$limit = opts.limit;

            var nodes = dpdSync.call(app.dpd.nodes.get, requestOptions);
            var nodeIds = _.pluck(nodes, 'id');
            var drafts = [];
            if (nodeIds.length > 0) {
                drafts = dpdSync.call(app.dpd.drafts.get, { refId: { $in: nodeIds }, user: user.id, collection: 'nodes' });
            }

            return getNodeDraftResults(opts.language, nodes, drafts);
        }
        else {
            var requestOptions = {};

            requestOptions.nodeId = { $nin: [opts.parentId] };
            requestOptions.hierarchy = opts.parentId;
            requestOptions.language = opts.language;

            if (opts.query)
                requestOptions.data = opts.query;
            
            if (opts.entities) {
                request.entity = {
                    $in: opts.entities
                }
            }

            requestOptions.$skip = opts.skip;
            requestOptions.$limit = opts.limit;
            
            var nodes = dpdSync.call(app.dpd.nodeurls.get, requestOptions);            
            return getNodeResults(nodes);
        }
    }

}