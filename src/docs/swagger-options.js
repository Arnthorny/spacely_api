const swaggerJsdoc = require('swagger-jsdoc');
const { schemas, responses } = require('./swagger_schema_responses');

const options = {
  definition: {
    openapi: '3.0.4',
    info: {
      title: 'Spacely API',
      description: 'API documentation for Spacely service',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas,
      responses,
    },
    servers: [
      {
        url: process.env.SERVER_URI || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      'Organisation',
      'User',
      'Admin',
      'Authentication',
      'Hub',
      'Workspace',
    ],
  },
};

// swaggerJsdoc(swaggerDocOptions)
const OASdoc = swaggerJsdoc({
  apis: ['./src/routes/v1/*.route.js'], // files containing annotations as above
  ...options,
});
module.exports = OASdoc;
