"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const blob_1 = require("@vercel/blob");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // حتماً dotenv برای خواندن .env
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'tmp/' });
/**
 * @swagger
 * tags:
 *   name: Test Upload
 *   description: Test file upload operations
 */
/**
 * @swagger
 * /test/upload:
 *   post:
 *     summary: Test file upload (without database)
 *     tags: [Test Upload]
 *     consumes:
 *       - multipart/form-data
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
 *                 description: File to upload for testing
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
 *         description: Bad request - No file uploaded
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'فایلی آپلود نشده' });
    try {
        const fileName = crypto_1.default.randomBytes(16).toString('hex') + '.' + req.file.originalname.split('.').pop();
        // استفاده از توکن از .env
        const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(req.file.path), {
            access: 'public',
            addRandomSuffix: true,
            token: process.env.BLOB_READ_WRITE_TOKEN || ''
        });
        fs_1.default.unlinkSync(req.file.path);
        return res.json({
            message: 'فایل با موفقیت آپلود شد',
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
//# sourceMappingURL=upload-test-route.js.map