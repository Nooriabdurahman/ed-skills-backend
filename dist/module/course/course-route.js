"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const blob_1 = require("@vercel/blob");
const course_services_1 = require("./course-services");
const course_validate_1 = require("./validate/course-validate");
const course_lessons_routes_1 = __importDefault(require("../course-lesson/course-lessons-routes"));
const router = express_1.default.Router();
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: 'tmp/',
    filename: (req, file, cb) => {
        cb(null, crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
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
        const validated = (0, course_validate_1.validateCourse)(req.body);
        if (validated?.error) {
            return res.status(400).json({ error: validated.error.details?.[0]?.message || "Invalid input" });
        }
        const value = validated?.value;
        let fileUrl = null;
        let trainerImageUrl = null;
        let typeImageUrl = null;
        const files = req.files;
        // Handle course image
        if (files && files.file && files.file[0]) {
            const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(files.file[0].originalname);
            const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(files.file[0].path), {
                access: 'public',
                addRandomSuffix: true
            });
            fileUrl = result.url;
            fs_1.default.unlinkSync(files.file[0].path);
        }
        // Handle trainer image
        if (files && files.trainerImage && files.trainerImage[0]) {
            const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(files.trainerImage[0].originalname);
            const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(files.trainerImage[0].path), {
                access: 'public',
                addRandomSuffix: true
            });
            trainerImageUrl = result.url;
            fs_1.default.unlinkSync(files.trainerImage[0].path);
        }
        // Handle type image
        if (files && files.typeImage && files.typeImage[0]) {
            const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(files.typeImage[0].originalname);
            const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(files.typeImage[0].path), {
                access: 'public',
                addRandomSuffix: true
            });
            typeImageUrl = result.url;
            fs_1.default.unlinkSync(files.typeImage[0].path);
        }
        const course = await (0, course_services_1.createCourse)({
            ...value,
            picture: fileUrl,
            trainerImage: trainerImageUrl,
            typeImage: typeImageUrl
        });
        return res.status(201).json({ course });
    }
    catch (err) {
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
        const courses = await (0, course_services_1.getAllCourses)();
        return res.status(200).json({ courses });
    }
    catch (err) {
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
        const course = await (0, course_services_1.getCourseById)(courseId);
        if (!course) {
            return res.status(200).json({ course: null, message: 'Course not found' });
        }
        return res.status(200).json({ course });
    }
    catch (err) {
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
        await (0, course_services_1.deleteCourse)(courseId);
        return res.status(200).json({ message: 'Course deleted successfully' });
    }
    catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Course not found' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Error deleting course' });
    }
});
router.use('/courses/:courseId/lessons', course_lessons_routes_1.default);
exports.default = router;
//# sourceMappingURL=course-route.js.map