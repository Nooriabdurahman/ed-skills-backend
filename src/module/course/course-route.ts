import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';
import { createCourse, getAllCourses, getCourseById } from './course-services';
import { validateCourse } from './validate/course-validate';
import courseLessonsRoutes from '../course-lesson/course-lessons-routes';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Manage courses
 */

/**
 * @swagger
 * /courses/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Course name
 *               description:
 *                 type: string
 *                 description: Course description
 *               subject:
 *                 type: string
 *                 description: Course subject
 *               materialType:
 *                 type: string
 *                 description: Material type (course, pages, learning path, quiz)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Course image file
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/courses', upload.single('file'), async (req, res) => {
  try {
    const validated = validateCourse(req.body);
    if (validated?.error) {
      return res.status(400).json({ error: validated.error.details?.[0]?.message || "Invalid input" });
    }
    const value = validated?.value;

    let fileUrl: string | null = null;

    if (req.file) {
      const fileName =
        crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);
      const result = await put(fileName, fs.readFileSync(req.file.path), {
        access: 'public',
        addRandomSuffix: true
      });
      fileUrl = result.url;
      fs.unlinkSync(req.file.path);
    }

    const course = await createCourse({
      ...value,
      picture: fileUrl
    });

    return res.status(201).json({ course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating course' });
  }
});

/**
 * @swagger
 * /courses/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.get('/courses', async (req, res) => {
  try {
    const courses = await getAllCourses();
    return res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching courses' });
  }
});

/**
 * @swagger
 * /courses/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/courses/:id', async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await getCourseById(courseId);
    if (!course) {
      return res.status(200).json({ course: null, message: 'Course not found' });
    }

    return res.status(200).json({ course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching course' });
  }
});

// Nested course lessons routes
router.use('/courses/:courseId/lessons', courseLessonsRoutes);

export default router;
