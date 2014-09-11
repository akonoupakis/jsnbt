var self = this;

if (self.config.computed) {
    delete self.config.computed;
}
else {
    this.modifiedOn = new Date().getTime();

    var hierarchyNodes = [];

    hierarchyNodes.push(this);
    
    var process = function () {
        var hierarchyNodeIds = [];

        hierarchyNodes.reverse();

        var newHierarchy = [];

        for (var i = 0; i < hierarchyNodes.length; i++) {
            newHierarchy.push(hierarchyNodes[i].id);
        }

        self.hierarchy = newHierarchy;

        materializeNodeUrls(self);

        processChildren(self);
    };

    var findNode = function (results, fn) {
        var found = false;

        for (var i = 0; i < results.length; i++) {
            found = fn(results[i]);
            if (found)
                return results[i];
        }

        return null;
    };

    var materializeNodeUrls = function (node) {
        dpd.nodeurls.get({ nodeId: node.id }, function (results, error) {
            if (error) {
                throw error;
            }
            else {
                var currentLanguages = [];
                for (var lang in node.data.localized) {
                    currentLanguages.push(lang);
                }

                var languagesToDelete = [];
                for (var i = 0; i < results.length; i++) {
                    if (currentLanguages.indexOf(results[i].language) == -1)
                        languagesToDelete.push(results[i].language);
                }

                dpd.nodes.get({ id: { $in: node.hierarchy } }, function (hResults, hError) {
                    if (hError)
                        throw hError;
                    else
                    {
                        for (var lang in node.data.localized) {

                            var localizedData = node.data.localized[lang];
                            if (localizedData.active) {

                                var urlValid = true;

                                var urlParts = [];
                                for (var i = 0; i < (node.hierarchy.length - 1) ; i++) {
                                    var hierachyNode = findNode(hResults, function (x) { return x.id == node.hierarchy[i]; });
                                    if (hierachyNode) {
                                        if (hierachyNode.data.localized[lang]) {
                                            urlParts.push(hierachyNode.data.localized[lang].seoName);
                                        }
                                        else {
                                            urlValid = false;
                                        }
                                    }
                                    else {
                                        urlValid = false;
                                    }
                                }
                                urlParts.push(node.data.localized[lang].seoName);

                                if (urlValid) {
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
                                        data: (['pointer', 'link'].indexOf(node.entity) != -1) ? localizedData[self.entity] : localizedData['content'],
                                        meta: localizedData.meta,
                                        active: localizedData.active
                                    };

                                    var existedNodeUrl = findNode(results, function (x) { return x.language === lang; });
                                    if (existedNodeUrl) {
                                        dpd.nodeurls.put(existedNodeUrl.id, nodeUrl, function (results, error) {
                                            if (error) {
                                                throw error;
                                            }
                                        });
                                    }
                                    else {
                                        dpd.nodeurls.post(nodeUrl, function (results, error) {
                                            if (error) {
                                                throw error;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                });

                for (var i = 0; i < languagesToDelete.length; i++) {
                    var nodeUrlToDelete = findNode(results, function (x) { return x.language === languagesToDelete[i]; });
                    dpd.nodeurls.del(nodeUrlToDelete.id, function (delResults, delError) {
                        if (delError) {
                            throw delError;
                        }
                    });
                }
            }
        });
    };

    var processChildren = function (node) {
        dpd.nodes.get({ domain: node.domain, parent: node.id }, function (results, error) {
            if (error) {
                throw error;
            }
            else {
                for (var i = 0; i < results.length; i++) {
                    var newHierarchy = node.hierarchy.slice(0);
                    newHierarchy.push(results[i].id);
                    
                    results[i].hierarchy = newHierarchy;
                    results[i].config.computed = true;

                    dpd.nodes.put(results[i].id, results[i], function (putResults, putError) {
                        if (putError) {
                            throw putError;
                        }
                        else {
                            materializeNodeUrls(putResults);
                            processChildren(putResults);
                        }
                    });

                }
            }
        });
    };

    var load = function (parent) {
        dpd.nodes.get(parent, function (result, error) {
            if (error) {
                throw error;
            }
            else {
                hierarchyNodes.push(result);
                if (result.parent && result.parent !== '')
                    load(result.parent);
                else
                    process();
            }
        });
    };
    
    if (this.parent && this.parent !== '') {
        load(this.parent);
    }
    else {
        process();
    };
}