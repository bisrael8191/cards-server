'use strict';

var Boom = require('boom');

function post(request, reply) {
  var card = request.payload;

  console.log('update: ' + JSON.stringify(card));

  // Make sure an Id wasn't passed in
  delete card.id;

  request.server.plugins['think-hapi'].r
    .db('cards')
    .table('cards')
    .get(request.params.cardId)
    .update(card, {returnChanges: true})
    .run(request.server.plugins['think-hapi'].conn)
    .then(function (status) {
      if (status.errors > 0 || status.replaced < 1) {
        request.log('error', 'Failed to update card: ' + status.first_error);
        return reply(Boom.badRequest('Failed to update card'));
      }

      reply(status.changes[0].new_val);
    })
    .error(function(err) {
      request.log('error', err);
      reply(Boom.badImplementation('DB error'));
    });
}

module.exports = post;
