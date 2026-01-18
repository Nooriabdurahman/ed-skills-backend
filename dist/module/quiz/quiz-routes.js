"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("./quiz-controller");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management and submission
 */
/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz for a course
 *     tags: [Quizzes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - name
 *             properties:
 *               courseId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               badgeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", quiz_controller_1.QuizController.createQuiz);
/**
 * @swagger
 * /quizzes/one-question:
 *   post:
 *     summary: Create a quiz with one question and four answers
 *     tags: [Quizzes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - name
 *               - question
 *               - answers
 *             properties:
 *               courseId:
 *                 type: integer
 *               name:
 *                 type: string
 *               question:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     answer:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *                 minItems: 4
 *                 maxItems: 4
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Bad request (invalid structure or correct answer count)
 */
router.post("/one-question", quiz_controller_1.QuizController.createOneQuestionQuiz);
/**
 * @swagger
 * /quizzes/questions:
 *   post:
 *     summary: Add a question to a quiz
 *     tags: [Quizzes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *               - question
 *             properties:
 *               quizId:
 *                 type: integer
 *               question:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question added successfully
 */
router.post("/questions", quiz_controller_1.QuizController.addQuestion);
/**
 * @swagger
 * /quizzes/answers:
 *   post:
 *     summary: Add an answer to a question
 *     tags: [Quizzes]
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
router.post("/answers", quiz_controller_1.QuizController.addAnswer);
/**
 * @swagger
 * /quizzes/{quizId}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz details
 */
router.get("/:quizId", quiz_controller_1.QuizController.getQuizById);
/**
 * @swagger
 * /quizzes/course/{courseId}:
 *   get:
 *     summary: Get all quizzes for a course
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of quizzes
 */
router.get("/course/:courseId", quiz_controller_1.QuizController.getQuizzesByCourse);
/**
 * @swagger
 * /quizzes/submit:
 *   post:
 *     summary: Submit quiz answers and get badge
 *     tags: [Quizzes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - quizId
 *               - answers
 *             properties:
 *               userId:
 *                 type: integer
 *               quizId:
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
 *         description: Quiz submitted successfully, badge awarded if passed
 */
router.post("/submit", quiz_controller_1.QuizController.submitQuiz);
/**
 * @swagger
 * /quizzes/user/{userId}/attempts:
 *   get:
 *     summary: Get user's quiz attempts
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of quiz attempts
 */
router.get("/user/:userId/attempts", quiz_controller_1.QuizController.getUserQuizAttempts);
/**
 * @swagger
 * /quizzes/user/{userId}/badges:
 *   get:
 *     summary: Get user's badges
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user badges
 */
router.get("/user/:userId/badges", quiz_controller_1.QuizController.getUserBadges);
exports.default = router;
//# sourceMappingURL=quiz-routes.js.map