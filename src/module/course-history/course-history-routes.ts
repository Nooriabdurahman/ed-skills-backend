import { Router } from "express";
import { CourseHistoryController } from "./course-history-controller";
import { auth } from "../../common/midlewere/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Course History
 *   description: Track and retrieve course viewing history for users
 */

/**
 * @swagger
 * /course-history:
 *   post:
 *     summary: Track when a user views a course
 *     tags: [Course History]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: The ID of the course being viewed
 *     responses:
 *       200:
 *         description: Course view tracked successfully
 *       400:
 *         description: Invalid courseId
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, CourseHistoryController.trackCourseView);

/**
 * @swagger
 * /course-history/my-history:
 *   get:
 *     summary: Get the authenticated user's course viewing history
 *     tags: [Course History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses the user has viewed
 *       401:
 *         description: Unauthorized
 */
router.get("/my-history", auth, CourseHistoryController.getMyCourseHistory);

/**
 * @swagger
 * /course-history/user/{userId}:
 *   get:
 *     summary: Get course history for a specific user
 *     tags: [Course History]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of courses the user has viewed
 *       400:
 *         description: Invalid User ID
 */
router.get("/user/:userId", CourseHistoryController.getUserCourseHistory);

/**
 * @swagger
 * /course-history/check/{courseId}:
 *   get:
 *     summary: Check if the authenticated user has viewed a specific course
 *     tags: [Course History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course to check
 *     responses:
 *       200:
 *         description: Whether the user has viewed the course
 *       400:
 *         description: Invalid Course ID
 *       401:
 *         description: Unauthorized
 */
router.get("/check/:courseId", auth, CourseHistoryController.checkCourseViewed);

/**
 * @swagger
 * /course-history/course/{courseId}/viewers:
 *   get:
 *     summary: Get all users who have viewed a specific course
 *     tags: [Course History]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: List of users who viewed the course
 *       400:
 *         description: Invalid Course ID
 */
router.get(
  "/course/:courseId/viewers",
  CourseHistoryController.getCourseViewers
);

export default router;

