"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const blob_1 = require("@vercel/blob");
const course_services_1 = require("./course-services");
const course_validate_1 = require("./validate/course-validate"); // <--- use validation here
const course_lessons_routes_1 = __importDefault(require("../course-lesson/course-lessons-routes"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'tmp/' });
// ==================== Create Course ====================
router.post('/courses', upload.single('file'), async (req, res) => {
    try {
        // Validate input using Joi
        const validated = (0, course_validate_1.validateCourse)(req.body);
        if (validated?.error) {
            return res.status(400).json({ error: validated.error.details?.[0]?.message || "Invalid input" });
        }
        const value = validated?.value;
        let fileUrl = null;
        if (req.file) {
            const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(req.file.originalname);
            const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(req.file.path), {
                access: 'public',
                addRandomSuffix: true
            });
            fileUrl = result.url;
            fs_1.default.unlinkSync(req.file.path);
        }
        const course = await (0, course_services_1.createCourse)({
            ...value,
            picture: fileUrl
        });
        return res.status(201).json({ course });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error creating course' });
    }
});
router.get('/courses', async (req, res) => {
    try {
        const courses = await (0, course_services_1.getAllCourses)();
        return res.status(200).json({ courses });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching courses' });
    }
});
// Nested course lessons routes
router.use('/courses/:courseId/lessons', course_lessons_routes_1.default);
exports.default = router;
//# sourceMappingURL=course-route.js.map