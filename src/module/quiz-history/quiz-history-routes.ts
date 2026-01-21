import { Router } from "express";
import { QuizHistoryController } from "./quiz-history-controller";
import { auth } from "../../common/midlewere/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Quiz History
 *   description: Track and retrieve quiz attempt history
 */

/**
 * @swagger
 * /quiz-history:
 *   get:
 *     summary: Get all quiz history (admin)
 *     tags: [Quiz History]
 *     responses:
 *       200:
 *         description: List of all quiz attempts
 */
router.get("/", QuizHistoryController.getAllQuizHistory);

/**
 * @swagger
 * /quiz-history/my-history:
 *   get:
 *     summary: Get the authenticated user's quiz history
 *     tags: [Quiz History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quiz attempts for the authenticated user
 *       401:
 *         description: Unauthorized
 */
router.get("/my-history", auth, QuizHistoryController.getMyQuizHistory);

/**
 * @swagger
 * /quiz-history/user/{userId}:
 *   get:
 *     summary: Get quiz history for a specific user
 *     tags: [Quiz History]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of quiz attempts for the user
 *       400:
 *         description: Invalid User ID
 */
router.get("/user/:userId", QuizHistoryController.getUserQuizHistory);

/**
 * @swagger
 * /quiz-history/quiz/{quizId}:
 *   get:
 *     summary: Get all attempts for a specific quiz
 *     tags: [Quiz History]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the quiz
 *     responses:
 *       200:
 *         description: List of attempts for the quiz
 *       400:
 *         description: Invalid Quiz ID
 */
router.get("/quiz/:quizId", QuizHistoryController.getQuizHistoryByQuizId);

/**
 * @swagger
 * /quiz-history/course/{courseId}:
 *   get:
 *     summary: Get all quiz attempts for a specific course
 *     tags: [Quiz History]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: List of quiz attempts for the course
 *       400:
 *         description: Invalid Course ID
 */
router.get("/course/:courseId", QuizHistoryController.getQuizHistoryByCourseId);

export default router;
