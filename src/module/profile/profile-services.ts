import { Request, Response } from 'express';
import prisma from '../../common/config/database/prisma';
import minioClient from '../../common/config/miniio';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// آپلود عکس پروفایل به MinIO
export const uploadProfilePicture = async (req: Request, res: Response): Promise<Response | void> => {
  const { userId } = req.body;
  if (!req.file) return res.status(400).json({ error: 'فایلی آپلود نشده' });

  const fileName = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);

  try {
    await minioClient.putObject('profiles-picture', fileName, fs.readFileSync(req.file.path));

    const url = `${process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000'}/profiles/${fileName}`;

    // ایجاد یا به‌روزرسانی رکورد پروفایل
    const profile = await prisma.profile.upsert({
      where: { userId: Number(userId) },
      update: { profilePicture: url },
      create: { userId: Number(userId), profilePicture: url },
    });

    fs.unlinkSync(req.file.path); // حذف فایل موقت
    return res.json({ profile, url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'آپلود موفق نبود' });
  }
};

// به‌روزرسانی اطلاعات پایه، نشان‌ها و مدارک
export const updateProfile = async (req: Request, res: Response) => {
  const { userId, bio, badges, certifications } = req.body;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: Number(userId) },
      update: { bio, badges, certifications },
      create: { userId: Number(userId), bio, badges, certifications },
    });

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'به‌روزرسانی پروفایل موفق نبود' });
  }
};

// گرفتن پروفایل یک کاربر
export const getProfileByUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { userId } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: Number(userId) },
    });

    if (!profile) return res.status(404).json({ error: 'پروفایل یافت نشد' });

    return res.json({ profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'خطا در گرفتن پروفایل' });
  }
};
