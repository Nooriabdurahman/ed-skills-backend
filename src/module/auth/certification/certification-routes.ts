import express from "express";
import { CertificationController } from "./certification-controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Certifications
 *   description: Certification management
 */

/**
 * @swagger
 * /certifications/award:
 *   post:
 *     summary: Award certification to user
 *     tags: [Certifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: integer
 *               courseId:
 *                 type: integer
 *               certificateUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Certification awarded successfully
 */
router.post("/award", CertificationController.awardCertification);

/**
 * @swagger
 * /certifications/check:
 *   post:
 *     summary: Check if user completed course and award certification
 *     tags: [Certifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: integer
 *               courseId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Certification status
 */
router.post("/check", CertificationController.checkAndAwardCertification);

/**
 * @swagger
 * /certifications/user/{userId}:
 *   get:
 *     summary: Get user's certifications
 *     tags: [Certifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user certifications
 */
router.get("/user/:userId", CertificationController.getUserCertifications);

/**
 * @swagger
 * /certifications/{certificationId}:
 *   get:
 *     summary: Get certification by ID
 *     tags: [Certifications]
 *     parameters:
 *       - in: path
 *         name: certificationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Certification details
 */
router.get("/:certificationId", CertificationController.getCertificationById);

/**
 * @swagger
 * /certifications/course/{courseId}:
 *   get:
 *     summary: Get certifications for a course
 *     tags: [Certifications]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of certifications for the course
 */
router.get(
  "/course/:courseId",
  CertificationController.getCourseCertifications
);

export default router;

