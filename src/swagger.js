const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 */

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'eCommerce',
    version: '1.0.0',
    description: 'API docs',
  },
  servers: [
    {
      url: `https://${process.env.VERCEL_URL || 'localhost:3001'}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {  
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


module.exports = {
  setupSwagger,
  swaggerSpec
};
