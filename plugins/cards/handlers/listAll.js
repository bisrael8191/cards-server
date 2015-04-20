'use strict';

var Boom = require('boom');

function get(request, reply) {
  request.server.plugins['think-hapi'].r
    .db('cards')
    .table('cards')
    .pluck('id', 'company', 'name')
    .run(request.server.plugins['think-hapi'].conn)
    .then(function(cursor) {
      return cursor.toArray();
    }).then(function (documents) {
      reply(documents);
    })
    .error(function(err) {
      request.log('error', err);
      reply(Boom.badImplementation('DB error'));
    })
}

module.exports = get;
