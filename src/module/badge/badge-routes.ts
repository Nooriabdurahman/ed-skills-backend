import express from "express";
import { BadgeController } from "./badge-controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Badges
 *   description: Badge management
 */

/**
 * @swagger
 * /badges:
 *   post:
 *     summary: Create a new badge
 *     tags: [Badges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Badge created successfully
 */
router.post("/", BadgeController.createBadge);

/**
 * @swagger
 * /badges:
 *   get:
 *     summary: Get all badges
 *     tags: [Badges]
 *     responses:
 *       200:
 *         description: List of badges
 */
router.get("/", BadgeController.getAllBadges);

/**
 * @swagger
 * /badges/{badgeId}:
 *   get:
 *     summary: Get badge by ID
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: badgeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Badge details
 */
router.get("/:badgeId", BadgeController.getBadgeById);

/**
 * @swagger
 * /badges/{badgeId}:
 *   put:
 *     summary: Update badge
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: badgeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Badge updated successfully
 */
router.put("/:badgeId", BadgeController.updateBadge);

/**
 * @swagger
 * /badges/{badgeId}:
 *   delete:
 *     summary: Delete badge
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: badgeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Badge deleted successfully
 */
router.delete("/:badgeId", BadgeController.deleteBadge);

export default router;

