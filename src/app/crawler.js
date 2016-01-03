var path = require('path')
var childProcess = require('child_process')

var _ = require('underscore');

_.str = require('underscore.string');

var Crawler = function (server) {
    this.server = server;
};

Crawler.prototype.crawl = function (url, cb) {

    var childArgs = [
        path.join(__dirname, 'crawl', 'phantom.js'),
        url
    ];

    childProcess.execFile('phantomjs', childArgs, function (err, stdout, stderr) {
        if (err) {
            return cb(err);
        }
        else {
            if (!_.str.startsWith(stdout, '200')) {
                var errorText = stdout.substring(3);
                cb(errorText);
            }
            else {
                var pageContent = stdout.substring(3);
                cb(null, pageContent);
            }
        }
    });

};

module.exports = function (server) {
    return new Crawler(server);
};