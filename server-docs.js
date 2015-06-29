var express = require('express');
var app = express();

app.use(function (req, res, next) {

    var requestedUrl = req._parsedUrl.pathname;

    var requestedUrlParts = requestedUrl.split('/');
    if (requestedUrlParts.length > 1) {
        var requestedPart = requestedUrlParts[1].toLowerCase();

        if (requestedPart === 'all.css') {
            res.contentType('text/css');
            res.status(200).send();
        }
        else if (requestedPart === 'all.js') {
            res.contentType('text/javascript');
            res.status(200).send();
        }
        else {
            next();
        }
    }
    else {
        next();
    }

});

app.use(express.static('docs'));



var server = app.listen(3001, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});