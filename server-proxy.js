var http = require('http')
, httpProxy = require('http-proxy');

httpProxy.createServer({
    hostnameOnly: true,
    router: {
        //web-development.cc
        'local.docs.jsnbt.com': 'http://localhost:3001'
    }
}).listen(3000);
