var path = require('path')
var childProcess = require('child_process')

var _ = require('underscore');

_.str = require('underscore.string');


exports.crawl = function(url, cb) {

    var childArgs = [
        path.join(__dirname, 'phantomScript.js'),
        url
    ];

    childProcess.execFile('phantomjs.exe', childArgs, function (err, stdout, stderr) {
        if (err) {
            cb(err);
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