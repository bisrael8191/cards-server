'use strict';

var Hapi = require('hapi');

var config = require('./config');
var external = require('./plugins/externalPlugins');

// Initialize Hapi REST server,
// make the config file accessible to all 
// plugins using 'server.settings.app'
var server = new Hapi.Server({
  app: config
});
server.connection(server.settings.app.options);

// Register 3rd party plugins (logging, swagger, etc)
external(server);

// Connect to rethinkdb server
server.register({
  register: require('./services/think-hapi'),
  options: server.settings.app.rethinkOptions
}, function (err) {
  if (err) {
    return server.log('error', 'Failed to connect to rethinkdb: ' + err);
  }

  // Configure API endpoints
  server.register({
      register: require('./plugins/cards')
    }, {
      routes: {
        prefix: server.settings.app.apiVersion || '/'
      }
    },
    function (err) {
      if (err) {
        server.log('error', 'Failed to load api: ' + err);
      }
    });
});

// Configure static asset routes (mainly for swagger)
server.register({
  register: require('./plugins/static')
}, function (err) {
  if (err) {
    server.log('error', 'Failed to load static routes: ' + err);
  }
});

// Start the server, unless it's being loaded as part of a unit test
if (!module.parent) {
  server.start(function () {
    server.log('server', 'Server running at: ' + server.info.uri);
  });
}

module.exports = server;
