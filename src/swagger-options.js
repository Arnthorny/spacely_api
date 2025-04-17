const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.4',
    info: {
      title: 'Spacely API',
      description: 'API documentation for Spacely service',
      version: '1.0.0',
    },
    components: {
      schemas: {},
    },
    servers: [
      {
        url: process.env.SERVER_URI || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
};

// swaggerJsdoc(swaggerDocOptions)
const OASdoc = swaggerJsdoc({
  apis: ['./src/routes/*.route.js'], // files containing annotations as above
  ...options,
});
module.exports = OASdoc;
