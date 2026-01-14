import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';
import { createCourse, deleteCourse, getAllCourses, getCourseById } from './course-services';
import { validateCourse } from './validate/course-validate';
import courseLessonsRoutes from '../course-lesson/course-lessons-routes';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: 'tmp/',
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

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
 *               trainerImage:
 *                 type: string
 *                 format: binary
 *                 description: Trainer image file
 *               typeImage:
 *                 type: string
 *                 format: binary
 *                 description: Type image file
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/courses', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'trainerImage', maxCount: 1 },
  { name: 'typeImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const validated = validateCourse(req.body);
    if (validated?.error) {
      return res.status(400).json({ error: validated.error.details?.[0]?.message || "Invalid input" });
    }
    const value = validated?.value;

    let fileUrl: string | null = null;
    let trainerImageUrl: string | null = null;
    let typeImageUrl: string | null = null;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Handle course image
    if (files && files.file && files.file[0]) {
      const fileName = crypto.randomBytes(16).toString('hex') + path.extname(files.file[0].originalname);
      const result = await put(fileName, fs.readFileSync(files.file[0].path), {
        access: 'public',
        addRandomSuffix: true
      });
      fileUrl = result.url;
      fs.unlinkSync(files.file[0].path);
    }

    // Handle trainer image
    if (files && files.trainerImage && files.trainerImage[0]) {
      const fileName = crypto.randomBytes(16).toString('hex') + path.extname(files.trainerImage[0].originalname);
      const result = await put(fileName, fs.readFileSync(files.trainerImage[0].path), {
        access: 'public',
        addRandomSuffix: true
      });
      trainerImageUrl = result.url;
      fs.unlinkSync(files.trainerImage[0].path);
    }

    // Handle type image
    if (files && files.typeImage && files.typeImage[0]) {
      const fileName = crypto.randomBytes(16).toString('hex') + path.extname(files.typeImage[0].originalname);
      const result = await put(fileName, fs.readFileSync(files.typeImage[0].path), {
        access: 'public',
        addRandomSuffix: true
      });
      typeImageUrl = result.url;
      fs.unlinkSync(files.typeImage[0].path);
    }

    const course = await createCourse({
      ...value,
      picture: fileUrl,
      trainerImage: trainerImageUrl,
      typeImage: typeImageUrl
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


/**
 * @swagger
 * /courses/courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
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
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete('/courses/:id',  deleteCourse);


router.use('/courses/:courseId/lessons', courseLessonsRoutes);

export default router;