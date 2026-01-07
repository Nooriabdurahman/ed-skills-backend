export declare class QuizService {
    /**
     * Create a quiz for a course
     */
    static createQuiz(courseId: number, name: string, description?: string, badgeId?: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        courseId: number;
        badgeId: number | null;
    }>;
    /**
     * Add a question to a quiz
     */
    static addQuestion(quizId: number, question: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        quizId: number;
    }>;
    /**
     * Add an answer to a quiz question
     */
    static addAnswer(questionId: number, answer: string, isCorrect: boolean): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        answer: string;
        isCorrect: boolean;
        questionId: number;
    }>;
    /**
     * Get quiz by ID with questions and answers
     */
    static getQuizById(quizId: number): Promise<({
        course: {
            id: number;
            name: string;
        };
        questions: ({
            answers: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                answer: string;
                isCorrect: boolean;
                questionId: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            quizId: number;
        })[];
        badge: {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            icon: string | null;
            updatedAt: Date;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        courseId: number;
        badgeId: number | null;
    }) | null>;
    /**
     * Get all quizzes for a course
     */
    static getQuizzesByCourse(courseId: number): Promise<({
        questions: ({
            answers: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                answer: string;
                isCorrect: boolean;
                questionId: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            quizId: number;
        })[];
        badge: {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            icon: string | null;
            updatedAt: Date;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        courseId: number;
        badgeId: number | null;
    })[]>;
    /**
     * Submit quiz answers and award badge if passed
     * Returns score and badge earned (if applicable)
     */
    static submitQuiz(userId: number, quizId: number, answers: {
        questionId: number;
        answerId: number;
    }[]): Promise<{
        attempt: {
            id: number;
            createdAt: Date;
            userId: number;
            updatedAt: Date;
            score: number;
            totalQuestions: number;
            correctAnswers: number;
            isPassed: boolean;
            quizId: number;
            badgeEarned: boolean;
        };
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        isPassed: boolean;
        badgeEarned: {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            icon: string | null;
            updatedAt: Date;
        } | null;
    }>;
    /**
     * Get user's quiz attempts
     */
    static getUserQuizAttempts(userId: number): Promise<({
        quiz: {
            course: {
                id: number;
                name: string;
            };
            badge: {
                id: number;
                createdAt: Date;
                name: string;
                description: string | null;
                icon: string | null;
                updatedAt: Date;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            updatedAt: Date;
            courseId: number;
            badgeId: number | null;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        isPassed: boolean;
        quizId: number;
        badgeEarned: boolean;
    })[]>;
    /**
     * Get user's badges
     */
    static getUserBadges(userId: number): Promise<({
        badge: {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            icon: string | null;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        badgeId: number;
        earnedAt: Date;
    })[]>;
}
//# sourceMappingURL=quiz-services.d.ts.map