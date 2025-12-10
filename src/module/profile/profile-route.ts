import express from 'express';
import multer from 'multer';
import {
  uploadProfilePicture,
  updateProfile,
  getProfileByUser,
} from './profile-services';

const router = express.Router();

// multer برای آپلود فایل
const upload = multer({ dest: 'tmp/' });

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
router.get('/:userId', getProfileByUser);

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
router.put('/update', updateProfile);

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
router.post('/upload-picture', upload.single('file'), uploadProfilePicture);

export default router;
