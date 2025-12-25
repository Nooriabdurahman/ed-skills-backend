"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressController = void 0;
const progress_services_1 = require("./progress-services");
class CourseProgressController {
    // Use instance methods or keep static, but be consistent
    static async markCompleted(req, res) {
        try {
            const { userId, lessonId } = req.body;
            const progress = await progress_services_1.CourseProgressService.markCompleted(userId, lessonId);
            return res.status(200).json({
                success: true,
                data: progress,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
        }
    }
    static async getUserProgress(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid User ID" });
            }
            const progress = await progress_services_1.CourseProgressService.getUserProgress(userId);
            return res.json({ success: true, data: progress });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Error fetching progress" });
        }
    }
}
exports.CourseProgressController = CourseProgressController;
//# sourceMappingURL=progress-controller.js.map