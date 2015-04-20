'use strict';

var Good = require('good');
var GoodConsole = require('good-console');
var GoodInflux = require('good-influxdb');
var swagger = require('hapi-swagger');

var pack = require('../package');

// Register and configure all 3rd party hapi plugins
module.exports = function register(server) {

  // Logging output and verbosity control for the Good plugin
  var reporters = [];

  if (server.settings.app.consoleEnabled === true) {
    reporters.push(new GoodConsole(
      server.settings.app.consoleEvents,
      server.settings.app.consoleOptions));
  }

  if (server.settings.app.influxEnabled === true) {
    reporters.push(new GoodInflux(
      server.settings.app.influxHost + ':' + server.settings.app.influxPort,
      server.settings.app.influxOptions));
  }

  var goodOptions = {
    reporters: reporters,
    opsInterval: server.settings.app.opsInterval
  };

  var swaggerOptions = {
    basePath: '',
    apiVersion: pack.version,
    documentation: '/documentation',
    endpoint: '/swagger',
    pathPrefixSize: 2,
    info: {
      'title': 'Cards REST API',
      'description': 'Documentation for the Cards REST API',
      'termsOfServiceUrl': 'http://cards.bisrael8191.com',
    }
  };

  server.register([
      {
        register: Good,
        options: goodOptions
    },
      {
        register: swagger,
        options: swaggerOptions
    }
  ],
    function (err) {
      if (err) throw err;
    });
};
