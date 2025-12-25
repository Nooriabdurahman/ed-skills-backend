"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePicture = uploadProfilePicture;
const crypto_1 = require("crypto");
const minioClient_1 = __importDefault(require("../common/utils/minioClient"));
const bucket_1 = require("../common/utils/bucket");
const prisma_1 = __importDefault(require("../common/config/database/prisma")); // فرض: export شده prisma client
const path_1 = __importDefault(require("path"));
const BUCKET = process.env.MINIO_BUCKET || 'profiles-picture';
const MINIO_HOST = process.env.MINIO_PUBLIC_HOST || `${process.env.MINIO_HOST || '127.0.0.1'}:${process.env.MINIO_PORT || 9000}`;
const USE_SSL = process.env.MINIO_USE_SSL === 'true';
async function uploadProfilePicture(buffer, originalName, userId) {
    // 1. اطمینان از وجود باکت
    await (0, bucket_1.ensureBucketExists)(BUCKET);
    // 2. اسم امن برای فایل بساز (برای جلوگیری از نام تکراری)
    const ext = path_1.default.extname(originalName) || '';
    const objectName = `profile-${userId}-${Date.now()}-${(0, crypto_1.randomUUID)()}${ext}`;
    // 3. آپلود با متادیتا (مثال Content-Type)
    await minioClient_1.default.putObject(BUCKET, objectName, buffer);
    // 4. ساختن URL عمومی
    // دو روش: (A) اگر باکت public است -> direct URL
    //           URL = http[s]://<host>:<port>/<bucket>/<object>
    //            توجه: اگر reverse proxy یا gateway داری، باید آن را استفاده کنی
    //         (B) اگر نمی‌خواهی باکت public کنی -> presigned URL با انقضاء
    // من هر دو را می‌سازم و اولویت می‌دهم direct اگر باکت public باشد (ما policy را ست کردیم)
    const protocol = USE_SSL ? 'https' : 'http';
    const directUrl = `${protocol}://${MINIO_HOST}/${BUCKET}/${encodeURIComponent(objectName)}`;
    // 5. ذخیره URL در دیتابیس (فرض: جدول user یا profile)
    const updated = await prisma_1.default.user.update({
        where: { id: userId },
        data: { profilePicture: directUrl },
    });
    // 6. به عنوان بکاپ، یک presigned URL هم تولید کنیم (مثال 7 روز)
    const presigned = await minioClient_1.default.presignedUrl('GET', BUCKET, objectName, 7 * 24 * 60 * 60);
    // برگرداندن نتیجه (در response از front-end می‌تونی directUrl را استفاده کنی)
    return {
        directUrl,
        presignedUrl: presigned,
        objectName,
        updatedUser: updated
    };
}
//# sourceMappingURL=s3serveice.js.map