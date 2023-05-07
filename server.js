// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })
var handler = require('./userHandling');
var jsonWorker = require('./jsonWorker');
var database = require('./databaseHandler');

/**
 * @type {import('fastify').RouteShorthandOptions}
 * @const
 */
const new_subscription = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          distributor_url: { type: 'string' },
          geocode: { type: 'String' }
        }
      }
    }
  }
}

const updated_subscription = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          distributor_url: { type: 'string' },
          new_geocodes: { type: 'array' },
          remove_geocodes: { type: 'array' }
        }
      }
    }
  }
}

const remove_subscription = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          distributor_url: { type: 'string' },
          reason: { type: 'String' }, 
        }
      }
    }
  }
}

// Declare a route
fastify.get('/', async (request, reply) => {
  reply
  .code(200)
  .type('text/html')
  .send('<h1>Hello World</h1>')
  console.log(request.body);
  return { hello: 'world' }
})

fastify.post('/registration', {new_subscription}, async (request, reply) => {
  handler.registration(request);
  return { status: 'success' }
})

fastify.post('/update', {updated_subscription}, async (request, reply) => {
  handler.update(request);
  return { status: 'success' }
})

fastify.post('/remove', {remove_subscription}, async (request, reply) => {
  handler.remove(request);
  return { status: 'success' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
// start the server
start() 

/*setInterval(
  jsonWorker.loadJson
  , 3000
);*/

// jsonWorker.loadJson()
