var page = require('webpage').create();
var system = require('system');
var args = system.args;

page.open(args[1], function (status) {
    if (status !== 'success') {
        console.log('500Unable to access network');
  } else {
        console.log('200' + page.content);
  }

  phantom.exit();
});
