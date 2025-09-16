const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User CRUD API',
      version: '1.0.0',
      description: 'Express + MongoDB with HTTP Basic Auth',
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        }
      }
    },
    security: [{ basicAuth: [] }], // <- require Basic for all endpoints by default
  },
  apis: ['./routes/*.js'], // keep your existing annotations
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };
