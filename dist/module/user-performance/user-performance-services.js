"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPerformanceService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class UserPerformanceService {
    /**
     * Start tracking lesson activity when user enters a lesson resource
     */
    static async startLessonActivity(userId, lessonId) {
        return prisma_1.default.userLessonActivity.create({
            data: {
                userId,
                lessonId,
                startTime: new Date(),
            },
        });
    }
    /**
     * End tracking lesson activity when user leaves
     */
    static async endLessonActivity(activityId) {
        const activity = await prisma_1.default.userLessonActivity.findUnique({
            where: { id: activityId },
        });
        if (!activity) {
            throw new Error("Activity not found");
        }
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - activity.startTime.getTime()) / 1000); // Duration in seconds
        return prisma_1.default.userLessonActivity.update({
            where: { id: activityId },
            data: {
                endTime,
                duration,
            },
        });
    }
    /**
     * Get user's performance statistics
     */
    static async getUserStats(userId) {
        // 1. Average Quiz Score
        const quizAttempts = await prisma_1.default.quizAttempt.findMany({
            where: { userId },
        });
        const finishedQuizzes = quizAttempts.length;
        let totalScore = 0;
        let wrongQuizzes = 0;
        quizAttempts.forEach((attempt) => {
            totalScore += attempt.score;
            if (!attempt.isPassed) {
                wrongQuizzes++;
            }
        });
        const averageScore = finishedQuizzes > 0 ? totalScore / finishedQuizzes : 0;
        // 2. Learning Hours
        const activities = await prisma_1.default.userLessonActivity.findMany({
            where: { userId },
        });
        const totalSeconds = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
        const learningHours = parseFloat((totalSeconds / 3600).toFixed(2));
        return {
            userId,
            finishedQuizzes,
            wrongQuizzes,
            averageScore: parseFloat(averageScore.toFixed(2)),
            totalLearningSeconds: totalSeconds,
            learningHours,
        };
    }
}
exports.UserPerformanceService = UserPerformanceService;
//# sourceMappingURL=user-performance-services.js.map