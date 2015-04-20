'use strict';

exports.register = function (server, options, next) {
  // Direct the root path to the swagger-ui documentation page
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: function (request, reply) {
      reply.redirect('/documentation').permanent();
    }
  });

  // Redirect the API base path back to the documentation
  if (server.settings.app.apiVersion) {
    server.route({
      method: 'GET',
      path: server.settings.app.apiVersion,
      config: {
        handler: function (request, reply) {
          reply.redirect('/documentation').permanent();
        }
      }
    });
  }

  next();
}

exports.register.attributes = {
  name: 'static',
  version: '0.0.1',
  dependencies: 'hapi-swagger'
};
