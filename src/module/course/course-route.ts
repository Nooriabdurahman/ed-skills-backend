import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse, duplicateCourse } from './course-services';
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
router.post('/courses', upload.any(), async (req: any, res: any) => {
  try {
    // 1. Parsing and refinement of numeric fields
    if (req.body.quizTotalScore === '' || req.body.quizTotalScore === 'null') {
      delete req.body.quizTotalScore;
    }
    if (req.body.quizPassingScore === '' || req.body.quizPassingScore === 'null') {
      delete req.body.quizPassingScore;
    }

    const validated = validateCourse(req.body);
    if (validated?.error) {
      return res.status(400).json({ error: validated.error.details?.[0]?.message || "Invalid input" });
    }
    const value = validated?.value;

    let fileUrl: string | null = null;
    let trainerImageUrl: string | null = null;
    let typeImageUrl: string | null = null;

    // 2. Handle generic file uploads from upload.any()
    // req.files is an array of files
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const fieldName = file.fieldname;
        // Upload to blob
        const fileName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
        const result = await put(fileName, fs.readFileSync(file.path), {
          access: 'public',
          addRandomSuffix: true
        });

        // Map common field names to our specific URL variables
        if (fieldName === 'file' || fieldName === 'courseImage' || fieldName === 'picture') {
          fileUrl = result.url;
        } else if (fieldName === 'trainerImage' || fieldName === 'trainer') {
          // careful: 'trainer' might be text field too, but here we process files
          trainerImageUrl = result.url;
        } else if (fieldName === 'typeImage') {
          typeImageUrl = result.url;
        }

        // Clean up local file
        fs.unlinkSync(file.path);
      }
    }

    const course = await createCourse({
      ...value,
      picture: fileUrl,
      trainerImage: trainerImageUrl,
      typeImage: typeImageUrl
    });

    return res.status(201).json({ course });
  } catch (err) {
    console.error("Error creating course:", err);
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
router.delete('/courses/:id', async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    await deleteCourse(courseId);
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error deleting course' });
  }
});


/**
 * @swagger
 * /courses/courses/update/{id}:
 *   put:
 *     summary: Update an existing course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
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
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.put('/courses/update/:id', upload.any(), async (req: any, res: any) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    let updateData = { ...req.body };

    // Handle generic file uploads
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const fieldName = file.fieldname;
        const fileName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
        const result = await put(fileName, fs.readFileSync(file.path), {
          access: 'public',
          addRandomSuffix: true
        });

        if (fieldName === 'file' || fieldName === 'courseImage' || fieldName === 'picture') {
          updateData.picture = result.url;
        } else if (fieldName === 'trainerImage' || fieldName === 'trainer') {
          updateData.trainerImage = result.url;
        } else if (fieldName === 'typeImage') {
          updateData.typeImage = result.url;
        }
        fs.unlinkSync(file.path);
      }
    }

    const course = await updateCourse(courseId, updateData);
    return res.status(200).json({ course });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    console.error("Error updating course:", err);
    return res.status(500).json({ error: 'Error updating course' });
  }
});

/**
 * @swagger
 * /courses/courses/duplicate/{id}:
 *   post:
 *     summary: Duplicate an existing course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID to duplicate
 *     responses:
 *       201:
 *         description: Course duplicated successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.post('/courses/duplicate/:id', async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const newCourse = await duplicateCourse(courseId);
    if (!newCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.status(201).json({ course: newCourse });
  } catch (err) {
    console.error("Error duplicating course:", err);
    return res.status(500).json({ error: 'Error duplicating course' });
  }
});

router.use('/courses/:courseId/lessons', courseLessonsRoutes);

export default router;