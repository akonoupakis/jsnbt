var node = requireApp('cms/nodeMngr.js')(server, db);

var self = this;

node.purgeCache(self.id);