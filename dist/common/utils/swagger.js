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
            title: 'Login-Signup API',
            version: '1.0.0',
            description: 'API documentation for login, signup, and events',
        },
        servers: [
            {
                url: 'http://localhost:2040',
            },
        ],
    },
    apis: [routesPathTs, routesPathJs],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map