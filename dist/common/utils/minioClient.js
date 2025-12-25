"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minio_1 = require("minio");
const minioClient = new minio_1.Client({
    endPoint: process.env.MINIO_HOST || '127.0.0.1',
    port: Number(process.env.MINIO_PORT || 9000),
    useSSL: process.env.MINIO_USE_SSL === 'true' || false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});
exports.default = minioClient;
//# sourceMappingURL=minioClient.js.map