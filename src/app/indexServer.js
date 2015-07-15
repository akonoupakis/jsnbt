var Server = require('./dpdServer');

module.exports = function (config) {
  return new Server(config);
};