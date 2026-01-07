"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const lesson_resource_controllers_1 = require("./lesson-resource-controllers");
const router = (0, express_1.Router)({ mergeParams: true });
const upload = (0, multer_1.default)({ dest: "tmp/" });
/**
 * @swagger
 * tags:
 *   name: Lesson Resources
 *   description: Manage resources for lessons
 */
/**
 * @swagger
 * /courses/courses/{courseId}/lessons/{lessonId}/resources:
 *   post:
 *     summary: Create a new resource for a lesson
 *     tags: [Lesson Resources]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 description: Resource name
 *               description:
 *                 type: string
 *                 description: Resource description
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Resource file (PDF, ZIP, Video, etc.)
 *     responses:
 *       201:
 *         description: Resource created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/", upload.single("file"), lesson_resource_controllers_1.LessonResourceController.create);
/**
 * @swagger
 * /courses/courses/{courseId}/lessons/{lessonId}/resources:
 *   get:
 *     summary: Get all resources for a lesson
 *     tags: [Lesson Resources]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *     responses:
 *       200:
 *         description: List of resources
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
router.get("/", lesson_resource_controllers_1.LessonResourceController.getByLesson);
/**
 * @swagger
 * /courses/courses/{courseId}/lessons/{lessonId}/resources/{id}:
 *   get:
 *     summary: Get a single resource by ID
 *     tags: [Lesson Resources]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Resource not found
 */
router.get("/:id", lesson_resource_controllers_1.LessonResourceController.getById);
/**
 * @swagger
 * /courses/courses/{courseId}/lessons/{lessonId}/resources/{id}:
 *   delete:
 *     summary: Delete a resource by ID
 *     tags: [Lesson Resources]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", lesson_resource_controllers_1.LessonResourceController.delete);
exports.default = router;
//# sourceMappingURL=lesson-resource-routes.js.map