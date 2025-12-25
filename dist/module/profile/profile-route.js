"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const profile_services_1 = require("./profile-services");
const router = express_1.default.Router();
// multer برای آپلود فایل
const upload = (0, multer_1.default)({ dest: 'tmp/' });
/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */
/**
 * @swagger
 * /profile/{userId}:
 *   get:
 *     summary: Get a profile by user ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get('/:userId', profile_services_1.getProfileByUser);
/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Update user profile info, badges, and documents
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *               skills:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 */
router.put('/update', profile_services_1.updateProfile);
/**
 * @swagger
 * /profile/upload-picture:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       400:
 *         description: File upload error
 */
router.post('/upload-picture', upload.single('file'), profile_services_1.uploadProfilePicture);
exports.default = router;
//# sourceMappingURL=profile-route.js.map