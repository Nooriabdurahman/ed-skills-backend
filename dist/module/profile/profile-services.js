"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileByUser = exports.updateProfile = exports.uploadProfilePicture = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
const blob_1 = require("@vercel/blob");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// آپلود عکس پروفایل به Vercel Blob
const uploadProfilePicture = async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'No file uploaded' });
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(req.file.originalname);
    try {
        const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(req.file.path), {
            access: 'public',
            addRandomSuffix: true
        });
        const url = result.url;
        const user = await prisma_1.default.user.update({
            where: { id: req.user.id },
            data: { profilePicture: url },
        });
        fs_1.default.unlinkSync(req.file.path);
        return res.json({ user, url });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Upload failed' });
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
            return res.status(200).json({ user: null, message: 'پروفایل یافت نشد' });
        return res.json({ user });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'خطا در گرفتن پروفایل' });
    }
};
exports.getProfileByUser = getProfileByUser;
//# sourceMappingURL=profile-services.js.map