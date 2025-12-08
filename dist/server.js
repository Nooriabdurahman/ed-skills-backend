"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app_1 = __importDefault(require("./app"));
const swagger_1 = __importDefault(require("./common/utils/swagger"));
const port = Number(process.env.PORT) || 8000;
// Swagger setup
app_1.default.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app_1.default.use((_req, res) => {
    res.status(404).json({ error: 'Route does not exist' });
});
// Start server
app_1.default.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map