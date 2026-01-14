"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPerformanceController = void 0;
const user_performance_services_1 = require("./user-performance-services");
class UserPerformanceController {
    /**
     * Start lesson activity
     */
    static async startLessonActivity(req, res) {
        try {
            const { userId, lessonId } = req.body;
            if (!userId || !lessonId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID and Lesson ID are required",
                });
            }
            const activity = await user_performance_services_1.UserPerformanceService.startLessonActivity(Number(userId), lessonId);
            return res.status(201).json({
                success: true,
                data: activity,
            });
        }
        catch (error) {
            console.error("Error starting lesson activity:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error starting lesson activity",
            });
        }
    }
    /**
     * End lesson activity
     */
    static async endLessonActivity(req, res) {
        try {
            const { activityId } = req.body;
            if (!activityId) {
                return res.status(400).json({
                    success: false,
                    message: "Activity ID is required",
                });
            }
            const activity = await user_performance_services_1.UserPerformanceService.endLessonActivity(Number(activityId));
            return res.status(200).json({
                success: true,
                data: activity,
            });
        }
        catch (error) {
            console.error("Error ending lesson activity:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error ending lesson activity",
            });
        }
    }
    /**
     * Get user stats
     */
    static async getUserStats(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }
            const stats = await user_performance_services_1.UserPerformanceService.getUserStats(userId);
            return res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            console.error("Error fetching user stats:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching user stats",
            });
        }
    }
}
exports.UserPerformanceController = UserPerformanceController;
//# sourceMappingURL=user-performance-controllers.js.map