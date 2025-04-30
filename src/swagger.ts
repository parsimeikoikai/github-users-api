import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitHub Users API',
      version: '1.0.0',
      description: 'API to fetch and cache GitHub users',
    },
    servers: [
      {
        url: 'http://localhost:3000', // change this in production
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // path to your route files with JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};