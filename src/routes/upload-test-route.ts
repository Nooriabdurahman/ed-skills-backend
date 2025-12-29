import express from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

// مسیر تست آپلود فایل بدون دیتابیس
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'فایلی آپلود نشده' });

  try {
    const fileName = crypto.randomBytes(16).toString('hex') + '.' + req.file.originalname.split('.').pop();
    const result = await put(fileName, fs.readFileSync(req.file.path), {
      access: 'public',
      addRandomSuffix: true
    });

    fs.unlinkSync(req.file.path);

    return res.json({
      message: 'فایل با موفقیت آپلود شد',
      url: result.url
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'آپلود موفق نبود', details: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
