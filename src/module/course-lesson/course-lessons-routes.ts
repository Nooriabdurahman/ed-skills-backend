import { Router } from "express";
import multer from "multer";
import { CourseLessonController } from "./course-lessons-controllers";

const router = Router({ mergeParams: true });
const upload = multer({ dest: "tmp/" });

/**
 * @swagger
 * tags:
 *   name: Course Lessons
 *   description: Manage lessons for courses
 */

/**
 * @swagger
 * /courses/courses/{courseId}/lessons:
 *   post:
 *     summary: Create a new lesson for a course
 *     tags: [Course Lessons]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course
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
 *                 description: Lesson name
 *               content:
 *                 type: string
 *                 description: HTML or text content of the lesson
 *               text:
 *                 type: string
 *                 description: Short description
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Lesson video file (optional)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Additional lesson file (PDF, ZIP, etc.)
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  CourseLessonController.create
);

/**
 * @swagger
 * /courses/courses/{courseId}/lessons:
 *   get:
 *     summary: Get all lessons for a course
 *     tags: [Course Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: List of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.get("/", CourseLessonController.getByCourse);

export default router;
