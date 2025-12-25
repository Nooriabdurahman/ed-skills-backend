"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const s3serveice_1 = require("../services/s3serveice");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/profile/:userId/upload', upload.single('file'), async (req, res) => {
    const { userId } = req.params;
    const file = req.file;
    if (!file)
        return res.status(400).json({ error: 'No file uploaded' });
    const id = Number(userId);
    if (!id || Number.isNaN(id))
        return res.status(400).json({ error: 'Invalid user id' });
    try {
        const result = await (0, s3serveice_1.uploadProfilePicture)(file.buffer, file.originalname, id);
        return res.json({ message: 'uploaded', url: result.directUrl, presigned: result.presignedUrl });
    }
    catch (err) {
        console.error(err);
        const errorDetails = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: 'Upload failed', details: errorDetails });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoute.js.map