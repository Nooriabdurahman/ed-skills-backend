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
    // آپلود فایل در MinIO
    await minioClient.putObject('profiles-picture', fileName, fs.readFileSync(req.file.path));

    const url = `${process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000'}/profiles/${fileName}`;

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

// به‌روزرسانی اطلاعات پایه، بیو و علایق
export const updateProfile = async (req: Request, res: Response) => {
  const { userId, bio, interests } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: { 
        bio: bio || undefined,
        interests: interests || undefined
      },
    });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'به‌روزرسانی پروفایل موفق نبود' });
  }
};

// گرفتن پروفایل یک کاربر
export const getProfileByUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
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

    if (!user) return res.status(404).json({ error: 'پروفایل یافت نشد' });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'خطا در گرفتن پروفایل' });
  }
};
