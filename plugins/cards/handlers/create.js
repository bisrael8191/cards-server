'use strict';

var Boom = require('boom');

function post(request, reply) {
  var card = request.payload;

  // Make sure an Id wasn't passed in
  delete card.id;

  request.server.plugins['think-hapi'].r
    .db('cards')
    .table('cards')
    .insert(card, {returnChanges: true})
    .run(request.server.plugins['think-hapi'].conn)
    .then(function (status) {
      if (status.errors > 0 || status.inserted < 1) {
        request.log('error', 'Failed to create new card: ' + status.first_error);
        return reply(Boom.badRequest('Failed to create new card'));
      }

      reply(status.changes[0].new_val).code(201);
    })
    .error(function(err) {
      request.log('error', err);
      reply(Boom.badImplementation('DB error'));
    });
}

module.exports = post;
