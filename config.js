'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname);

// Defaults that you can access when you require this config
module.exports = {
  // Root path, use as a base when requiring project files
  root: rootPath,

  // Turn on development mode using the NODE_ENV variable
  development: (process.env.NODE_ENV === 'development') ? true : false,

  // Hapi server options
  options: {
    // Hapi requires a hostname, 0.0.0.0 listens on all network interfaces
    host: process.env.HOST || '0.0.0.0',
  
    // Server port, can override using the PORT environment variable
    port: parseInt(process.env.PORT, 10) || 5555,

    // Setup allowUnknown to relax the constraint of the ICD to allow extra
    // fields. This eases the pain of integration, and allow user to store 
    // extra metadata in our database.
    routes: {
      cors: true,
      validate: {
        options: {
          allowUnknown: true
        }
      }
    }
  },

  // API route version and prefix
  apiVersion: process.env.API_VER || '/v0',

  // Logging options
  opsInterval: process.env.OPS_INTERVAL || 1000,
  
  consoleEnabled: process.env.CONSOLE_ENABLED === '1' ? true : false,
  consoleEvents: { error: '*', log: ['server', 'error', 'medium', 'warn', 'think-hapi'] },
  consoleOptions: { format: 'YYYY-MM-DDTHH:mm:ss.SSS' },
  
  influxEnabled: process.env.INFLUX_ENABLED === '1' ? true : false,
  influxHost: process.env.INFLUX_HOST || 'http://127.0.0.1',
  influxPort: parseInt(process.env.INFLUX_PORT) || 8086,
  influxOptions: {
    database: process.env.INFLUX_DB || 'cards',
    username: process.env.INFLUX_USER || 'root',
    password: process.env.INFLUX_PW || 'root',
    events: { ops: '*', log: '*', error: '*', request: '*', response: '*' }
  },

  // Rethinkdb config
  // See API for more info: http://rethinkdb.com/api/javascript/#connect
  rethinkOptions: {
    host: process.env.RETHINK_HOST || '127.0.0.1',
    port: parseInt(process.env.RETHINK_PORT) || 28015,
    db: process.env.RETHINK_DB || null,
    authKey: process.env.RETHINK_AUTHKEY || null,
    timeout: parseInt(process.env.RETHINK_TIMEOUT) || null,
    // Timeout (in milliseconds) before attempting to reconnect
    // to rethinkdb. Set to 0 to disable reconnect attempts.
    reconnectTimeout: parseInt(process.env.RETHINK_RECONNECT) || 2000
  }
};
