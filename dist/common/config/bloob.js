"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePicture = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
const blob_1 = require("@vercel/blob");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// آپلود عکس پروفایل به Vercel Blob
const uploadProfilePicture = async (req, res) => {
    const { userId } = req.body;
    if (!req.file)
        return res.status(400).json({ error: 'فایلی آپلود نشده' });
    const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(req.file.originalname);
    try {
        // آپلود فایل در Vercel Blob
        const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(req.file.path), {
            access: 'public', // می‌تواند 'private' هم باشد
            addRandomSuffix: true
        });
        const url = result.url; // URL فایل آپلود شده
        // به‌روزرسانی عکس پروفایل در جدول User
        const user = await prisma_1.default.user.update({
            where: { id: Number(userId) },
            data: { profilePicture: url },
        });
        fs_1.default.unlinkSync(req.file.path); // حذف فایل موقت
        return res.json({ user, url });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'آپلود موفق نبود' });
    }
};
exports.uploadProfilePicture = uploadProfilePicture;
//# sourceMappingURL=bloob.js.map