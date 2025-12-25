"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileByUser = exports.updateProfile = exports.uploadProfilePicture = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
const miniio_1 = __importDefault(require("../../common/config/miniio"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// آپلود عکس پروفایل به MinIO
const uploadProfilePicture = async (req, res) => {
    const { userId } = req.body;
    if (!req.file)
        return res.status(400).json({ error: 'فایلی آپلود نشده' });
    const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(req.file.originalname);
    try {
        // آپلود فایل در MinIO
        await miniio_1.default.putObject('profiles-picture', fileName, fs_1.default.readFileSync(req.file.path));
        const url = `${process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000'}/profiles/${fileName}`;
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
// به‌روزرسانی اطلاعات پایه، بیو و علایق
const updateProfile = async (req, res) => {
    const { userId, bio, interests } = req.body;
    try {
        const user = await prisma_1.default.user.update({
            where: { id: Number(userId) },
            data: {
                bio: bio || undefined,
                interests: interests || undefined
            },
        });
        res.json({ user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'به‌روزرسانی پروفایل موفق نبود' });
    }
};
exports.updateProfile = updateProfile;
// گرفتن پروفایل یک کاربر
const getProfileByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                email: true,
                username: true,
                age: true,
                profilePicture: true,
                bio: true,
                interests: true,
                createdAt: true
            }
        });
        if (!user)
            return res.status(404).json({ error: 'پروفایل یافت نشد' });
        return res.json({ user });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'خطا در گرفتن پروفایل' });
    }
};
exports.getProfileByUser = getProfileByUser;
//# sourceMappingURL=profile-services.js.map