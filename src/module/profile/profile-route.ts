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

// گرفتن پروفایل یک کاربر
router.get('/:userId', getProfileByUser);

// به‌روزرسانی اطلاعات پایه، نشان‌ها و مدارک
router.put('/update', updateProfile);

// آپلود عکس پروفایل
router.post('/upload-picture', upload.single('file'), uploadProfilePicture);

export default router;
