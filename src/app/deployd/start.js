var Server = require('./server');
var upgrade = require('doh').upgrade;
var Monitor = require('./monitor');
var commands = {};

commands.start = function (config, fn) {
  var server = new Server(config);
  upgrade(server);
  server.on('listening', fn);
  server.on('error', fn);
  server.listen();
};

Monitor.createCommands(commands);