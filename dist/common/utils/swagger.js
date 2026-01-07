"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = require("path");
const routesPathTs = (0, path_1.join)(__dirname, '../../module/**/*.ts');
const routesPathJs = (0, path_1.join)(__dirname, '../../module/**/*.js');
const options = {
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
    apis: [routesPathTs, routesPathJs, (0, path_1.join)(__dirname, '../../routes/**/*.ts'), (0, path_1.join)(__dirname, '../../routes/**/*.js')],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map