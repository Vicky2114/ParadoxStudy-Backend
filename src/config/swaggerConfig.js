const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Paradox Study APIs',
    version: '1.0.0',
    description: 'API Documentation using Swagger',
  },
  servers: [
    {
      url: 'http://localhost:8000/api',
      description: 'Development server',
    },
    {
      url: 'https://projectdev2114.azurewebsites.net/api',
      description: 'Production/Live server',
    },
  ],
  
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Format of the token
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/models/*.js'], // Relative paths
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;