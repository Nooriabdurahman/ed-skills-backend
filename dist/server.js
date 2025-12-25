"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app_1 = __importDefault(require("./app"));
const swagger_1 = __importDefault(require("./common/utils/swagger"));
const os_1 = __importDefault(require("os"));
const PORT = Number(process.env.PORT) || 2040;
// Swagger setup
app_1.default.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app_1.default.use((_req, res) => {
    res.status(404).json({ error: 'Route does not exist' });
});
// Function to get local IP address
function getLocalIP() {
    const interfaces = os_1.default.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}
// Start server
app_1.default.listen(PORT, () => {
    const IP = getLocalIP();
    console.log(`Server running at:`);
    console.log(`- Local:   http://localhost:${PORT}`);
    console.log(`- Network: http://${IP}:${PORT}`);
});
//# sourceMappingURL=server.js.map