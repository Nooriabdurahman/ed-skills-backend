import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import prisma from '../../common/config/database/prisma';
import minioClient from '../../common/config/miniio';

const router = express.Router();
const upload = multer({ dest: 'tmp/' }); // Temporary storage for multer

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course with optional media file
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               subject:
 *                 type: string
 *               materialType:
 *                 type: string
 *               materialCount:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
 */
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
      materialStatus,
      isCertified,
      type,
      progress,
      duration
    } = req.body;

    let fileUrl = null;

    if (req.file) {
      // Upload file to MinIO
      const fileName = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);
      await minioClient.putObject('course-materials', fileName, fs.readFileSync(req.file.path));
      fileUrl = `${process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000'}/course-materials/${fileName}`;
      fs.unlinkSync(req.file.path); // Remove temp file
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
        // schema fields use quizTotalScore / quizPassingScore
        quizTotalScore: totalScore ? Number(totalScore) : null,
        quizPassingScore: passingScore ? Number(passingScore) : null,
        status,
        // schema field name is materialStatusType
        materialStatusType: materialStatus,
        isCertified: isCertified === 'true',
        // store uploaded file URL in picture (optional string)
        picture: fileUrl,
        // typeImage is the closest match for incoming `type`
        typeImage: type,
        progress: progress ? Number(progress) : 0,
        // store duration as text to match prisma schema (String?)
        duration: duration ?? null
      }
    });

    res.status(201).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating course' });
  }
});

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get('/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

export default router;
