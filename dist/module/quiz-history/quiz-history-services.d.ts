export declare class QuizHistoryService {
    /**
     * Get quiz history for a specific user
     */
    static getUserQuizHistory(userId: number): Promise<({
        quiz: {
            course: {
                id: number;
                name: string;
                subject: string;
            };
            badge: {
                id: number;
                createdAt: Date;
                name: string;
                description: string | null;
                icon: string | null;
                updatedAt: Date;
            } | null;
            lesson: {
                id: string;
                name: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            updatedAt: Date;
            courseId: number;
            badgeId: number | null;
            lessonId: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        quizId: number;
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        isPassed: boolean;
        performanceLabel: string | null;
        badgeEarned: boolean;
    })[]>;
    /**
     * Get all quiz attempts (admin)
     */
    static getAllQuizHistory(): Promise<({
        user: {
            id: number;
            email: string;
            username: string;
        };
        quiz: {
            course: {
                id: number;
                name: string;
                subject: string;
            };
            badge: {
                id: number;
                createdAt: Date;
                name: string;
                description: string | null;
                icon: string | null;
                updatedAt: Date;
            } | null;
            lesson: {
                id: string;
                name: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            updatedAt: Date;
            courseId: number;
            badgeId: number | null;
            lessonId: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        quizId: number;
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        isPassed: boolean;
        performanceLabel: string | null;
        badgeEarned: boolean;
    })[]>;
    /**
     * Get quiz history for a specific quiz
     */
    static getQuizHistoryByQuizId(quizId: number): Promise<({
        user: {
            id: number;
            email: string;
            username: string;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        quizId: number;
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        isPassed: boolean;
        performanceLabel: string | null;
        badgeEarned: boolean;
    })[]>;
    /**
     * Get quiz history for a specific course
     */
    static getQuizHistoryByCourseId(courseId: number): Promise<({
        user: {
            id: number;
            email: string;
            username: string;
        };
        quiz: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        quizId: number;
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        isPassed: boolean;
        performanceLabel: string | null;
        badgeEarned: boolean;
    })[]>;
}
//# sourceMappingURL=quiz-history-services.d.ts.map