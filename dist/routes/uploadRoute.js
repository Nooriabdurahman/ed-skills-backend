"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const blob_1 = require("@vercel/blob");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * @swagger
 * tags:
 *   name: File Upload
 *   description: File upload operations
 */
/**
 * @swagger
 * /files/{userId}/upload:
 *   post:
 *     summary: Upload a file for a user
 *     tags: [File Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Bad request - No file uploaded or invalid user ID
 *       500:
 *         description: Server error
 */
router.post('/:userId/upload', upload.single('file'), async (req, res) => {
    const { userId } = req.params;
    const file = req.file;
    if (!file)
        return res.status(400).json({ error: 'فایلی آپلود نشده' });
    const id = Number(userId);
    if (!id || Number.isNaN(id))
        return res.status(400).json({ error: 'شناسه کاربر نامعتبر است' });
    try {
        const fileName = crypto_1.default.randomBytes(16).toString('hex') + '.' + file.originalname.split('.').pop();
        const result = await (0, blob_1.put)(fileName, file.buffer, {
            access: 'public',
            addRandomSuffix: true,
            token: process.env.BLOB_READ_WRITE_TOKEN || ''
        });
        return res.json({
            message: 'آپلود پروفایل موفق بود',
            url: result.url
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'آپلود موفق نبود',
            details: err instanceof Error ? err.message : String(err)
        });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoute.js.map