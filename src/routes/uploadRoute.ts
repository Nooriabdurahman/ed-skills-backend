import { Router } from 'express';
import multer from 'multer';
import { uploadProfilePicture } from '../services/s3serveice';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/profile/:userId/upload', upload.single('file'), async (req, res) => {
  const { userId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const id = Number(userId);
  if (!id || Number.isNaN(id)) return res.status(400).json({ error: 'Invalid user id' });

  try {
    const result = await uploadProfilePicture(file.buffer, file.originalname, id);
    return res.json({ message: 'uploaded', url: result.directUrl, presigned: result.presignedUrl });
  } catch (err) {
    console.error(err);
    const errorDetails = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: 'Upload failed', details: errorDetails });
  }
});

export default router;
