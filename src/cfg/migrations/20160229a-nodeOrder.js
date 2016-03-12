module.exports = {

    name: '20160229a-nodeOrder',

    process: function (server, cb) {
        
        var store = server.db.createStore('nodes');
        store.put(function (x) {
            x.query({});
            x.data({
                order: 0
            });
        }, cb);
    }

};