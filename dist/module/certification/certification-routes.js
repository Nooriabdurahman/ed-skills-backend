"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const certification_controller_1 = require("./certification-controller");
const router = express_1.default.Router();
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
router.post("/award", certification_controller_1.CertificationController.awardCertification);
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
router.post("/check", certification_controller_1.CertificationController.checkAndAwardCertification);
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
router.get("/user/:userId", certification_controller_1.CertificationController.getUserCertifications);
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
router.get("/:certificationId", certification_controller_1.CertificationController.getCertificationById);
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
router.get("/course/:courseId", certification_controller_1.CertificationController.getCourseCertifications);
exports.default = router;
//# sourceMappingURL=certification-routes.js.map