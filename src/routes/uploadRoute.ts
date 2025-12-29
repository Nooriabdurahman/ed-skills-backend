import { Router } from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// مسیر آپلود پروفایل
router.post('/:userId/upload', upload.single('file'), async (req, res) => {
  const { userId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'فایلی آپلود نشده' });

  const id = Number(userId);
  if (!id || Number.isNaN(id)) return res.status(400).json({ error: 'شناسه کاربر نامعتبر است' });

  try {
    const fileName = crypto.randomBytes(16).toString('hex') + '.' + file.originalname.split('.').pop();

    const result = await put(fileName, file.buffer, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN || ''

    });

    return res.json({
      message: 'آپلود پروفایل موفق بود',
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
