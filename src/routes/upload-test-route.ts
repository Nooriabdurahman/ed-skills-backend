import express from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(); // حتماً dotenv برای خواندن .env

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

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
  if (!req.file) return res.status(400).json({ error: 'فایلی آپلود نشده' });

  try {
    const fileName = crypto.randomBytes(16).toString('hex') + '.' + req.file.originalname.split('.').pop();

    // استفاده از توکن از .env
    const result = await put(fileName, fs.readFileSync(req.file.path), {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN || ''
    });

    fs.unlinkSync(req.file.path);

    return res.json({
      message: 'فایل با موفقیت آپلود شد',
      url: result.url
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'آپلود موفق نبود',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

export default router;
