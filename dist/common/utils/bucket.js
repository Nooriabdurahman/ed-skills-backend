"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureBucketExists = ensureBucketExists;
const minioClient_1 = __importDefault(require("./minioClient"));
async function ensureBucketExists(bucketName) {
    const exists = await minioClient_1.default.bucketExists(bucketName);
    if (!exists) {
        await minioClient_1.default.makeBucket(bucketName, 'us-east-1');
        // اگر می‌خواهی باکت خواندنی‌عمومی باشد (public), می‌توانی policy اضافه کنی:
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${bucketName}/*`]
                }
            ]
        };
        await minioClient_1.default.setBucketPolicy(bucketName, JSON.stringify(policy));
    }
}
//# sourceMappingURL=bucket.js.map