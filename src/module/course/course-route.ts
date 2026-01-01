import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import prisma from '../../common/config/database/prisma';
import { put } from '@vercel/blob';

const router = express.Router();
const upload = multer({ dest: 'tmp/' }); // Temporary storage for multer

// ==================== Create Course ====================
router.post('/courses', upload.single('file'), async (req, res) => {
  try {
    const {
      name,
      description,
      subject,
      materialType,
      materialCount,
      firstRecommendation,
      secondRecommendation,
      totalScore,
      passingScore,
      status,
      materialStatusType, // ← اینجا نام دقیق
      isCertified,
      type,
      progress,
      duration
    } = req.body;

    // بررسی فیلدهای ضروری
    if (!name || !description || !materialStatusType) {
      return res.status(400).json({ error: 'فیلدهای ضروری پر نشده‌اند' });
    }

    let fileUrl: string | null = null;

    if (req.file) {
      const fileName =
        crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);
      const result = await put(fileName, fs.readFileSync(req.file.path), {
        access: 'public',
        addRandomSuffix: true
      });
      fileUrl = result.url; // URL فایل آپلود شده
      fs.unlinkSync(req.file.path); // پاک کردن فایل موقت
    }

    const course = await prisma.course.create({
      data: {
        name,
        description,
        subject,
        materialType,
        materialCount,
        firstRecommendation,
        secondRecommendation,
        quizTotalScore: totalScore ? Number(totalScore) : null,
        quizPassingScore: passingScore ? Number(passingScore) : null,
        status: status || 'notStarted',
        materialStatusType: materialStatusType || 'NotStartedCourse', // ← مقدار پیشفرض
        isCertified: isCertified === 'true',
        picture: fileUrl,
        typeImage: type || null,
        progress: progress ? Number(progress) : 0,
        duration: duration || null
      }
    });

    return res.status(201).json({ course });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'خطا در ایجاد دوره' });
  }
});

// ==================== Get All Courses ====================
router.get('/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'خطا در دریافت دوره‌ها' });
  }
});

export default router;
