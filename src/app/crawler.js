var path = require('path')
var childProcess = require('child_process')

var _ = require('underscore');

_.str = require('underscore.string');

var Crawler = function (server) {

    return {

        crawl: function (url, onSuccess, onError) {

            var childArgs = [
                path.join(__dirname, 'crawling', 'phantom.js'),
                url
            ];

            childProcess.execFile('phantomjs.exe', childArgs, function (err, stdout, stderr) {
                if (err) {
                    onError(err);
                }
                else {
                    if (!_.str.startsWith(stdout, '200')) {
                        var errorText = stdout.substring(3);
                        onError(errorText);
                    }
                    else {
                        var pageContent = stdout.substring(3);
                        onSuccess(pageContent);
                    }
                }
            });

        }

    };

};

module.exports = Crawler;