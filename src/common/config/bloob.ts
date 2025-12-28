import { Request, Response } from 'express';
import prisma from '../../common/config/database/prisma';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// آپلود عکس پروفایل به Vercel Blob
export const uploadProfilePicture = async (req: Request, res: Response): Promise<Response | void> => {
  const { userId } = req.body;
  if (!req.file) return res.status(400).json({ error: 'فایلی آپلود نشده' });

  const fileName = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);

  try {
    // آپلود فایل در Vercel Blob
    const result = await put(fileName, fs.readFileSync(req.file.path), {
      access: 'public',        // می‌تواند 'private' هم باشد
      addRandomSuffix: true
    });

    const url = result.url; // URL فایل آپلود شده

    // به‌روزرسانی عکس پروفایل در جدول User
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: { profilePicture: url },
    });

    fs.unlinkSync(req.file.path); // حذف فایل موقت
    return res.json({ user, url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'آپلود موفق نبود' });
  }
};
