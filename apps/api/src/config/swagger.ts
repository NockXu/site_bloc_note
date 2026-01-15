import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'A REST API for managing users and their notes',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated user ID',
            },
            username: {
              type: 'string',
              description: 'Unique username',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'password123',
            },
          },
        },
        Note: {
          type: 'object',
          required: ['titre', 'contenu', 'userId'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated note ID',
            },
            titre: {
              type: 'string',
              description: 'Note title',
              example: 'Meeting Notes',
            },
            contenu: {
              type: 'string',
              description: 'Note content',
              example: 'Discuss project timeline and deliverables',
            },
            userId: {
              type: 'integer',
              description: 'ID of the user who owns this note',
              example: 1,
            },
            user: {
              $ref: '#/components/schemas/User',
              description: 'User who owns this note',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);

export const swaggerUiOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .scheme-container { margin: 20px 0 }
  `,
};

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(specs, swaggerUiOptions));
};
