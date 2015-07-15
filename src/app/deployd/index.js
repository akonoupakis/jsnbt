var Server = require('./server');

module.exports = function (config) {
  return new Server(config);
};