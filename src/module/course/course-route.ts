import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';
import { createCourse, getAllCourses } from './course-services';
import { validateCourse } from './validate/course-validate'; // <--- use validation here

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

// ==================== Create Course ====================
router.post('/courses', upload.single('file'), async (req, res) => {
  try {
    // Validate input using Joi
    const validated = validateCourse(req.body);
    if (validated?.error) {
      return res.status(400).json({ error: validated.error.details?.[0]?.message || "Invalid input" });
    }
    const value = validated?.value;

    let fileUrl: string | null = null;

    if (req.file) {
      const fileName =
        crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);
      const result = await put(fileName, fs.readFileSync(req.file.path), {
        access: 'public',
        addRandomSuffix: true
      });
      fileUrl = result.url;
      fs.unlinkSync(req.file.path);
    }

    const course = await createCourse({
      ...value,
      picture: fileUrl
    });

    return res.status(201).json({ course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating course' });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await getAllCourses();
    return res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching courses' });
  }
});

export default router;