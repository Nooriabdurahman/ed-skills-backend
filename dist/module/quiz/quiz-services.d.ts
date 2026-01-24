export declare class QuizService {
    /**
     * Create a quiz for a course
     */
    static createQuiz(courseId: number, name: string, description?: string, badgeId?: number, lessonId?: string): Promise<{
        questions: ({
            answers: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                answer: string;
                isCorrect: boolean;
                questionId: number;
                order: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            question: string;
            quizId: number;
            score: number;
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
        lessonId: string | null;
        badgeId: number | null;
    }>;
    /**
     * Create a quiz with a single question and answers
     */
    static createOneQuestionQuiz(courseId: number, name: string, questionText: string, answers: {
        answer: string;
        isCorrect: boolean;
    }[], lessonId?: string): Promise<{
        questions: ({
            answers: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                answer: string;
                isCorrect: boolean;
                questionId: number;
                order: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            question: string;
            quizId: number;
            score: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        courseId: number;
        lessonId: string | null;
        badgeId: number | null;
    }>;
    /**
     * Add a question to a quiz
     */
    /**
     * Add a question to a quiz
     */
    static addQuestion(quizId: number, question: string, type?: string, score?: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        question: string;
        quizId: number;
        score: number;
    }>;
    /**
     * Add an answer to a quiz question
     */
    /**
     * Add an answer to a quiz question
     */
    static addAnswer(questionId: number, answer: string, isCorrect: boolean, order?: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        answer: string;
        isCorrect: boolean;
        questionId: number;
        order: number | null;
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
                order: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            question: string;
            quizId: number;
            score: number;
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
        lessonId: string | null;
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
                order: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            question: string;
            quizId: number;
            score: number;
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
        lessonId: string | null;
        badgeId: number | null;
    })[]>;
    /**
     * Submit quiz answers and award badge if passed
     * Returns score and badge earned (if applicable)
     */
    /**
     * Submit quiz answers and award badge if passed
     * Returns score and badge earned (if applicable)
     */
    static submitQuiz(userId: number, quizId: number, answers: {
        questionId: number;
        answerId?: number;
        answerIds?: number[];
    }[]): Promise<{
        attempt: {
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
        };
        score: number;
        earnedPoints: number;
        totalPossiblePoints: number;
        correctAnswers: number;
        totalQuestions: number;
        isPassed: boolean;
        performanceLabel: string;
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
            lessonId: string | null;
            badgeId: number | null;
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
    /**
     * Delete a quiz by ID
     */
    static deleteQuiz(quizId: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        courseId: number;
        lessonId: string | null;
        badgeId: number | null;
    }>;
}
//# sourceMappingURL=quiz-services.d.ts.map