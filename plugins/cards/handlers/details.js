'use strict';

var Boom = require('boom');

function get(request, reply) {
  request.server.plugins['think-hapi'].r
    .db('cards')
    .table('cards')
    .get(request.params.cardId)
    .run(request.server.plugins['think-hapi'].conn)
    .then(function (doc) {
      if (!doc) {
        return reply(Boom.notFound('Card not found'));
      }

      reply(doc);
    })
    .error(function(err) {
      request.log('error', err);
      reply(Boom.badImplementation('DB error'));
    });
}

module.exports = get;
