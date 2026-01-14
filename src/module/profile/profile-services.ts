import { Request, Response } from 'express';
import prisma from '../../common/config/database/prisma';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../../common/midlewere/authMiddlewere';

// آپلود عکس پروفایل به Vercel Blob
export const uploadProfilePicture = async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const fileName = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);

  try {
    const result = await put(fileName, fs.readFileSync(req.file.path), {
      access: 'public',
      addRandomSuffix: true
    });

    const url = result.url;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePicture: url },
    });

    fs.unlinkSync(req.file.path);
    return res.json({ user, url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed' });
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

    if (!user) return res.status(200).json({ user: null, message: 'پروفایل یافت نشد' });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'خطا در گرفتن پروفایل' });
  }
};
