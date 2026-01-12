import prisma from "../../common/config/database/prisma";

export class UserPerformanceService {
    /**
     * Start tracking lesson activity when user enters a lesson resource
     */
    static async startLessonActivity(userId: number, lessonId: string) {
        return prisma.userLessonActivity.create({
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
    static async endLessonActivity(activityId: number) {
        const activity = await prisma.userLessonActivity.findUnique({
            where: { id: activityId },
        });

        if (!activity) {
            throw new Error("Activity not found");
        }

        const endTime = new Date();
        const duration = Math.floor(
            (endTime.getTime() - activity.startTime.getTime()) / 1000
        ); // Duration in seconds

        return prisma.userLessonActivity.update({
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
    static async getUserStats(userId: number) {
        // 1. Average Quiz Score
        const quizAttempts = await prisma.quizAttempt.findMany({
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
        const activities = await prisma.userLessonActivity.findMany({
            where: { userId },
        });

        const totalSeconds = activities.reduce(
            (sum, activity) => sum + (activity.duration || 0),
            0
        );
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
