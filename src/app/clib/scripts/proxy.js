(function (undefined) {

    // initial socket connection
    var socket = io.connect(root);

    var root = $('html > head > base').prop('href');
    if (root.indexOf('/admin/') !== -1) {
        var paths = root.split('/');
        paths.pop();
        paths.pop();
        root = paths.join('/') + '/';
    }

    var PROXY = function (resource) {
        return {
            get: function (query, cb) {
                var url = root + 'jsnbt-db/' + resource;
                var queryInternal = typeof (query) === 'function' ? undefined : query;
                var urlPartInternal = undefined;

                if (typeof (queryInternal) === 'string') {
                    urlPartInternal = queryInternal;
                    queryInternal = undefined;
                }

                var callbackInternal = typeof (query) === 'function' ? query : cb;

                if (typeof (queryInternal) === 'string') {
                    url += '/' + queryInternal;
                }
                else {
                    if (typeof (queryInternal) === 'object') {
                        queryInternal = JSON.stringify(queryInternal);
                    }
                }

                var urlInternal = url;
                if (urlPartInternal)
                    urlInternal += '/' + urlPartInternal;
                if (queryInternal)
                    urlInternal += '?q=' + encodeURIComponent(queryInternal);

                $.ajax({
                    url: urlInternal
                }).done(function (data, ex) {
                    callbackInternal(null, data);
                })
                .error(function (ex) {
                    if (ex.responseJSON && ex.responseJSON[404]) {
                        callbackInternal(null, null);
                    }
                    else {
                        callbackInternal(ex.responseJSON);
                    }
                });
            },

            post: function (data, cb) {
                var url = root + 'jsnbt-db/' + resource;

                $.ajax({
                    url: url,
                    method: 'POST',
                    data: JSON.stringify(data)
                }).done(function (result) {
                    cb(null, result);
                })
                .error(function (ex) {
                    cb(ex.responseJSON);
                });
            },

            put: function (query, data, cb) {

                var url = root + 'jsnbt-db/' + resource;
                var queryInternal = query;
                var urlPartInternal = undefined;

                if (typeof (queryInternal) === 'string') {
                    urlPartInternal = queryInternal;
                    queryInternal = undefined;
                }

                if (typeof (queryInternal) === 'string') {
                    url += '/' + queryInternal;
                }
                else {
                    if (typeof (queryInternal) === 'object') {
                        queryInternal = JSON.stringify(queryInternal);
                    }
                }

                var urlInternal = url;
                if (urlPartInternal)
                    urlInternal += '/' + urlPartInternal;
                if (queryInternal)
                    urlInternal += '?q=' + encodeURIComponent(queryInternal);

                $.ajax({
                    url: urlInternal,
                    method: 'PUT',
                    data: JSON.stringify(data)
                }).done(function (result) {
                    cb(null, result);
                })
                .error(function (ex) {
                    if (ex.responseJSON && ex.responseJSON[404]) {
                        cb(null, null);
                    }
                    else {
                        cb(ex.responseJSON);
                    }
                });
            },

            count: function (query, cb) {
                var url = root + 'jsnbt-db/' + resource + '/count';
                var queryInternal = typeof (query) === 'function' ? undefined : query;

                if (typeof (queryInternal) === 'string') {
                    queryInternal = undefined;
                }

                var callbackInternal = typeof (query) === 'function' ? query : cb;

                if (typeof (queryInternal) === 'object') {
                    queryInternal = JSON.stringify(queryInternal);
                }

                var urlInternal = url;
                
                if (queryInternal)
                    urlInternal += '?q=' + encodeURIComponent(queryInternal);

                $.ajax({
                    url: urlInternal
                }).done(function (data, ex) {
                    callbackInternal(null, data);
                })
                .error(function (ex) {
                    if (ex.responseJSON && ex.responseJSON[404]) {
                        callbackInternal(null, null);
                    }
                    else {
                        callbackInternal(ex.responseJSON);
                    }
                });
            },

            del: function (query, cb) {
                var url = root + 'jsnbt-db/' + resource;
                var queryInternal = typeof (query) === 'function' ? undefined : query;
                var urlPartInternal = undefined;

                if (typeof (queryInternal) === 'string') {
                    urlPartInternal = queryInternal;
                    queryInternal = undefined;
                }

                var callbackInternal = typeof (query) === 'function' ? query : cb;

                if (typeof (queryInternal) === 'string') {
                    url += '/' + queryInternal;
                }
                else {
                    if (typeof (queryInternal) === 'object') {
                        queryInternal = JSON.stringify(queryInternal);
                    }
                }

                var urlInternal = url;
                if (urlPartInternal)
                    urlInternal += '/' + urlPartInternal;
                if (queryInternal)
                    urlInternal += '?q=' + encodeURIComponent(queryInternal);

                $.ajax({
                    url: urlInternal,
                    method: 'DELETE'
                }).done(function (data, ex) {
                    callbackInternal(null, data);
                })
                .error(function (ex) {
                    if (ex.responseJSON && ex.responseJSON[404]) {
                        callbackInternal(null, null);
                    }
                    else {
                        callbackInternal(ex.responseJSON);
                    }
                });
            }

        };
    };


    window.PROXY = function (collection) {
        return new PROXY(collection);
    };

    window.PROXY.on = function () {
        socket.on.apply(socket, arguments);
    };

    window.PROXY.once = function (name, fn) {
        var _fn = function () {
            socket.removeListener(name, _fn);
            fn.apply(this, arguments);
        };
        socket.on(name, _fn);
    };

    window.PROXY.off = function (name, fn) {
        if (fn == null) {
            socket.removeAllListeners(name);
        } else {
            socket.removeListener(name, fn);
        } 
    };
    
    var isSocketReady = false;
    window.PROXY.once('connect', function () { 
        isSocketReady = true;
    });

    window.PROXY.socketReady = function (fn) {
        if (isSocketReady) {
            setTimeout(fn, 0);
        } else {
            window.PROXY.once('connect', fn);
        }
    };

    window.PROXY.socket = socket;


})();