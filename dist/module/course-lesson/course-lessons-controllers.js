"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseLessonController = void 0;
const course_lessons_services_1 = require("./course-lessons-services");
class CourseLessonController {
    static async create(req, res) {
        try {
            const lesson = await course_lessons_services_1.CourseLessonService.create(req.body);
            return res.status(201).json({ success: true, data: lesson });
        }
        catch (error) {
            return res
                .status(400)
                .json({ success: false, message: "Could not create lesson" });
        }
    }
    static async getByCourse(req, res) {
        try {
            const courseId = req.query.courseId; // Standardized to query or params
            if (!courseId)
                return res.status(400).json({ message: "courseId is required" });
            const numericCourseId = Number(courseId);
            if (isNaN(numericCourseId)) {
                return res.status(400).json({ message: "courseId must be a number" });
            }
            const lessons = await course_lessons_services_1.CourseLessonService.getByCourse(numericCourseId);
            return res.json({ success: true, data: lessons });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
}
exports.CourseLessonController = CourseLessonController;
//# sourceMappingURL=course-lessons-controllers.js.map