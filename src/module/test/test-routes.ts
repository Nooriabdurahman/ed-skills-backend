import express from "express";
import { TestController } from "./test-controller";
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Test management and submission
 */

/**
 * @swagger
 * /tests:
 *   post:
 *     summary: Create a new test for a course
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               courseId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               trainer:
 *                 type: string
 *               trainerImage:
 *                 type: string
 *                 format: binary
 *               icon:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *               topic:
 *                 type: string
 *               materialType:
 *                 type: string
 *               status:
 *                 type: string
 *               type:
 *                 type: string
 *               points:
 *                 type: integer
 *               passingPoints:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Test created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'trainerImage', maxCount: 1 }, { name: 'testFile', maxCount: 1 }]), TestController.createTest);

/**
 * @swagger
 * /tests/questions:
 *   post:
 *     summary: Add a question to a test
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testId
 *               - question
 *             properties:
 *               testId:
 *                 type: integer
 *               question:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question added successfully
 */
router.post("/questions", TestController.addQuestion);

/**
 * @swagger
 * /tests/answers:
 *   post:
 *     summary: Add an answer to a question
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - answer
 *               - isCorrect
 *             properties:
 *               questionId:
 *                 type: integer
 *               answer:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Answer added successfully
 */
router.post("/answers", TestController.addAnswer);

/**
 * @swagger
 * /tests/{testId}:
 *   get:
 *     summary: Get test by ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Test details
 */
router.get("/:testId", TestController.getTestById);

/**
 * @swagger
 * /tests/course/{courseId}:
 *   get:
 *     summary: Get all tests for a course
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tests
 */
router.get("/course/:courseId", TestController.getTestsByCourse);

/**
 * @swagger
 * /tests/submit:
 *   post:
 *     summary: Submit test answers and get points
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - testId
 *               - answers
 *             properties:
 *               userId:
 *                 type: integer
 *               testId:
 *                 type: integer
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                     answerId:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Test submitted successfully, points awarded
 */
router.post("/submit", TestController.submitTest);

/**
 * @swagger
 * /tests/user/{userId}/attempts:
 *   get:
 *     summary: Get user's test attempts
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of test attempts
 */
router.get("/user/:userId/attempts", TestController.getUserTestAttempts);

/**
 * @swagger
 * /tests/user/{userId}/points:
 *   get:
 *     summary: Get user's total points from tests
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Total points
 */
router.get("/user/:userId/points", TestController.getUserTotalPoints);

export default router;

