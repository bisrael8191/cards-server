'use strict';

var r = require('rethinkdb');
var Joi = require('joi');

// Store the rethink options
var rethinkOpts = {};
var reconnectTimeout = 0;

// Rethinkdb connection options schema
var schema = Joi.object().options({
  abortEarly: false
}).keys({
  host: Joi.string().hostname().required().label('rethinkdb hostname'),
  port: Joi.number().integer().min(1).max(65535).required().label('rethinkdb driver port'),
  db: Joi.string().allow('').optional().label('rethinkdb default database'),
  authKey: Joi.string().allow('').optional().label('rethinkdb driver authKey'),
  timeout: Joi.number().integer().min(0).max(300).optional().label('rethinkdb connection timeout')
});

// Configure a new connection to rethinkdb
function configure(server, conn) {
  // Expose the rethink library and connection
  server.expose('r', r);
  server.expose('conn', conn);

  // Log any rethinkdb connection errors
  conn.on('error', function (err) {
    server.log(['think-hapi', 'error'], 'Connection error event: ' + err);
  });

  // Log any rethinkdb connection timeout events
  conn.on('timeout', function (err) {
    server.log(['think-hapi', 'error'], 'Connection timeout event: ' + err);
  });

  // Handle close event
  conn.on('close', function () {
    server.log(['think-hapi', 'info'], 'Rethinkdb connection closed');
    if (reconnectTimeout > 0) {
      server.log(['think-hapi', 'warn'], 'Trying to reconnect in ' + reconnectTimeout + 'ms');
      setTimeout(connect, reconnectTimeout, server);
    }
  });

  server.log(['think-hapi', 'info'],
    'Successfully connected to rethinkdb');
}

function connect(server, cb) {
  cb = cb || function () {};

  // Create a driver connection to rethinkdb
  r.connect(rethinkOpts, function (err, conn) {
    if (err) {
      server.log(['think-hapi', 'error'], 'Error connecting to rethinkdb: ' + err);

      // If the initial connection failed, but reconnect is enabled
      // try again after a delay, otherwise return the error
      if (reconnectTimeout > 0) {
        err = null; // Don't pass the error to the main next() callback
        server.log(['think-hapi', 'warn'], 'Trying to reconnect in ' + reconnectTimeout + 'ms');
        setTimeout(connect, reconnectTimeout, server, null);
      } else {
        return cb(err);
      }
    } else {
      // Setup the new connection
      configure(server, conn);
    }

    cb(err);
  });
}

exports.register = function (server, options, next) {
  // Create rethinkdb connection options
  // See official API: http://rethinkdb.com/api/javascript/#connect
  rethinkOpts.host = options.host || 'localhost';
  rethinkOpts.port = options.port || 28015;
  if (options.db) rethinkOpts.db = options.db;
  if (options.authKey) rethinkOpts.authKey = options.authKey;
  if (options.timeout) rethinkOpts.timeout = options.timeout;

  if (options.reconnectTimeout) reconnectTimeout = options.reconnectTimeout;

  // Validate the user input
  Joi.validate(rethinkOpts, schema, function (err, validOpts) {
    if (err) {
      server.log(['think-hapi', 'error'], 'Error parsing options: ' + err);
      return next(err);
    }

    // Store the validated options
    rethinkOpts = validOpts;

    // Create a driver connection to rethinkdb
    connect(server, function (err) {
      // Completed registering the plugin
      return next(err);
    });
  });
}

exports.register.attributes = {
  name: 'think-hapi',
  version: '0.0.1'
};
