"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseLessonController = void 0;
const course_lessons_services_1 = require("./course-lessons-services");
const blob_1 = require("@vercel/blob");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CourseLessonController {
    static async create(req, res) {
        try {
            const { courseId } = req.params;
            if (!courseId) {
                return res.status(400).json({
                    success: false,
                    message: "courseId is required",
                });
            }
            let video = null;
            // Video upload is optional - only upload if file is provided
            if (req.file) {
                const fileName = crypto_1.default.randomBytes(16).toString("hex") +
                    path_1.default.extname(req.file.originalname);
                const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(req.file.path), {
                    access: "public",
                    addRandomSuffix: true,
                });
                video = result.url;
                fs_1.default.unlinkSync(req.file.path);
            }
            const lesson = await course_lessons_services_1.CourseLessonService.create({
                ...req.body,
                courseId,
                video,
            });
            return res.status(201).json({
                success: true,
                data: lesson,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: "Could not create lesson",
            });
        }
    }
    static async getByCourse(req, res) {
        try {
            const { courseId } = req.params;
            if (!courseId) {
                return res.status(400).json({
                    success: false,
                    message: "courseId is required",
                });
            }
            const numericCourseId = Number(courseId);
            if (isNaN(numericCourseId)) {
                return res.status(400).json({
                    success: false,
                    message: "courseId must be a number",
                });
            }
            const lessons = await course_lessons_services_1.CourseLessonService.getByCourse(numericCourseId);
            return res.json({
                success: true,
                data: lessons,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
}
exports.CourseLessonController = CourseLessonController;
//# sourceMappingURL=course-lessons-controllers.js.map