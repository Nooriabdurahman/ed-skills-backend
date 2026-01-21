"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizHistoryController = void 0;
const quiz_history_services_1 = require("./quiz-history-services");
class QuizHistoryController {
    /**
     * Get quiz history for authenticated user
     * GET /quiz-history/my-history
     */
    static async getMyQuizHistory(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized - User not authenticated",
                });
            }
            const history = await quiz_history_services_1.QuizHistoryService.getUserQuizHistory(userId);
            return res.status(200).json({
                success: true,
                data: history,
                count: history.length,
            });
        }
        catch (error) {
            console.error("Error fetching quiz history:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
    /**
     * Get quiz history for a specific user
     * GET /quiz-history/user/:userId
     */
    static async getUserQuizHistory(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid User ID",
                });
            }
            const history = await quiz_history_services_1.QuizHistoryService.getUserQuizHistory(userId);
            return res.status(200).json({
                success: true,
                data: history,
                count: history.length,
            });
        }
        catch (error) {
            console.error("Error fetching user quiz history:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
    /**
     * Get all quiz history (admin)
     * GET /quiz-history
     */
    static async getAllQuizHistory(req, res) {
        try {
            const history = await quiz_history_services_1.QuizHistoryService.getAllQuizHistory();
            return res.status(200).json({
                success: true,
                data: history,
                count: history.length,
            });
        }
        catch (error) {
            console.error("Error fetching all quiz history:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
    /**
     * Get quiz history for a specific quiz
     * GET /quiz-history/quiz/:quizId
     */
    static async getQuizHistoryByQuizId(req, res) {
        try {
            const quizId = Number(req.params.quizId);
            if (isNaN(quizId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Quiz ID",
                });
            }
            const history = await quiz_history_services_1.QuizHistoryService.getQuizHistoryByQuizId(quizId);
            return res.status(200).json({
                success: true,
                data: history,
                count: history.length,
            });
        }
        catch (error) {
            console.error("Error fetching quiz history by quiz ID:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
    /**
     * Get quiz history for a specific course
     * GET /quiz-history/course/:courseId
     */
    static async getQuizHistoryByCourseId(req, res) {
        try {
            const courseId = Number(req.params.courseId);
            if (isNaN(courseId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Course ID",
                });
            }
            const history = await quiz_history_services_1.QuizHistoryService.getQuizHistoryByCourseId(courseId);
            return res.status(200).json({
                success: true,
                data: history,
                count: history.length,
            });
        }
        catch (error) {
            console.error("Error fetching quiz history by course ID:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
}
exports.QuizHistoryController = QuizHistoryController;
//# sourceMappingURL=quiz-history-controller.js.map