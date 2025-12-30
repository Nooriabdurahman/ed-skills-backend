import { Request, Response } from 'express';
import prisma from '../../common/config/database/prisma';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/* ===============================
   Helper: get userId from token
================================ */
function getUserIdFromToken(req: Request): number | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

/* ===============================
   Upload profile picture (TOKEN)
================================ */
export const uploadProfilePicture = async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileName =
    crypto.randomBytes(16).toString('hex') +
    path.extname(req.file.originalname);

  try {
    const result = await put(fileName, fs.readFileSync(req.file.path), {
      access: 'public',
      addRandomSuffix: true,
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: result.url },
    });

    fs.unlinkSync(req.file.path);
    return res.json({ user, url: result.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

/* ===============================
   Update profile (TOKEN)
================================ */
export const updateProfile = async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { bio, interests } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: bio || undefined,
        interests: interests || undefined,
      },
    });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Update failed' });
  }
};

/* ===============================
   Get my profile (TOKEN)
================================ */
export const getProfileByUser = async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        age: true,
        profilePicture: true,
        bio: true,
        interests: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Fetch failed' });
  }
};
