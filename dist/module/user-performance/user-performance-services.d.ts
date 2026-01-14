export declare class UserPerformanceService {
    /**
     * Start tracking lesson activity when user enters a lesson resource
     */
    static startLessonActivity(userId: number, lessonId: string): Promise<{
        id: number;
        userId: number;
        duration: number | null;
        lessonId: string;
        startTime: Date;
        endTime: Date | null;
    }>;
    /**
     * End tracking lesson activity when user leaves
     */
    static endLessonActivity(activityId: number): Promise<{
        id: number;
        userId: number;
        duration: number | null;
        lessonId: string;
        startTime: Date;
        endTime: Date | null;
    }>;
    /**
     * Get user's performance statistics
     */
    static getUserStats(userId: number): Promise<{
        userId: number;
        finishedQuizzes: number;
        wrongQuizzes: number;
        averageScore: number;
        totalLearningSeconds: number;
        learningHours: number;
    }>;
}
//# sourceMappingURL=user-performance-services.d.ts.map