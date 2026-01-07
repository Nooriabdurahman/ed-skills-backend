"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const badge_controller_1 = require("./badge-controller");
const router = express_1.default.Router();
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
router.post("/", badge_controller_1.BadgeController.createBadge);
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
router.get("/", badge_controller_1.BadgeController.getAllBadges);
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
router.get("/:badgeId", badge_controller_1.BadgeController.getBadgeById);
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
router.put("/:badgeId", badge_controller_1.BadgeController.updateBadge);
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
router.delete("/:badgeId", badge_controller_1.BadgeController.deleteBadge);
exports.default = router;
//# sourceMappingURL=badge-routes.js.map