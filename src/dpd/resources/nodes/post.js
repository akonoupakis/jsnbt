var self = this;

this.createdOn = new Date().getTime();
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

    var nodeUrls = [];

    for (var lang in self.data.localized) {

        var localizedData = self.data.localized[lang];
        if (localizedData.active) {

            var urlValid = true;

            var urlParts = [];
            for (var i = 0; i < hierarchyNodes.length; i++) {
                if (hierarchyNodes[i].data.localized[lang])
                    urlParts.push(hierarchyNodes[i].data.localized[lang].seoName);
                else
                    urlValid = false;
            }

            if (urlValid) {
                nodeUrls.push({
                    nodeId: self.id,
                    language: lang,
                    code: self.code,
                    domain: self.domain,
                    entity: self.entity,
                    url: '/' + urlParts.join('/'),
                    secure: self.secure,
                    hierarchy: self.hierarchy,
                    view: self.view,
                    data: (['pointer', 'link'].indexOf(self.entity) != -1) ? localizedData[self.entity] : localizedData['content'],
                    meta: localizedData.meta,
                    active: localizedData.active
                });
            }

        }
    }

    var processUrls = function () {
        
        var nUrl = nodeUrls.pop();
        if (nUrl) {
            dpd.nodeurls.post(nUrl, function (results, error) {
                if (error)
                    throw error;
                else
                    processUrls();
            });
        }
    };

    processUrls();
};

var load = function (parent) {
    dpd.nodes.get(parent, function (result, error) {
        if (error) {
            throw error;
        }
        else {
            hierarchyNodes.push(result);
            if (result.parent)
                load(result.parent);
            else
                process();
        }
    });
};

if (this.parent) {
    load(this.parent);
}
else {
    process();
};