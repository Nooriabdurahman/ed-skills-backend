import swaggerJsDoc from 'swagger-jsdoc';
import path, { join } from 'path';


const routesPathTs = join(__dirname, '../../module/**/*.ts');
const routesPathJs = join(__dirname, '../../module/**/*.js');

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ed-Skills Backend API',
      version: '1.0.0',
      description: 'Complete API documentation for Ed-Skills backend including courses, lessons, resources, users, and more',
    },
    servers: [
      {
        url: 'https://ed-skills-backend-1.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:2040',
        description: 'Local development server',
      },
    ],
  },
  apis: [routesPathTs, routesPathJs, join(__dirname, '../../routes/**/*.ts'), join(__dirname, '../../routes/**/*.js')],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
