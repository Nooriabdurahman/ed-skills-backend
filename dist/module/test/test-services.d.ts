export declare class TestService {
    /**
     * Create a test for a course
     */
    static createTest(courseId: number, name: string, description?: string): Promise<{
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
            testId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        courseId: number;
    }>;
    /**
     * Add a question to a test
     */
    static addQuestion(testId: number, question: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        testId: number;
    }>;
    /**
     * Add an answer to a test question
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
     * Get test by ID with questions and answers
     */
    static getTestById(testId: number): Promise<({
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
            testId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        courseId: number;
    }) | null>;
    /**
     * Get all tests for a course
     */
    static getTestsByCourse(courseId: number): Promise<({
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
            testId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        courseId: number;
    })[]>;
    /**
     * Submit test answers and calculate score
     * Returns points earned and creates TestAttempt and UserPoint records
     */
    static submitTest(userId: number, testId: number, answers: {
        questionId: number;
        answerId: number;
    }[]): Promise<{
        attempt: {
            id: number;
            createdAt: Date;
            userId: number;
            updatedAt: Date;
            testId: number;
            score: number;
            totalQuestions: number;
            correctAnswers: number;
            isPassed: boolean;
            performanceLabel: string | null;
        };
        score: number;
        percentage: number;
        correctAnswers: number;
        totalQuestions: number;
        isPassed: boolean;
        performanceLabel: string;
    }>;
    /**
     * Get user's test attempts
     */
    static getUserTestAttempts(userId: number): Promise<({
        test: {
            course: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            updatedAt: Date;
            courseId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        testId: number;
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        isPassed: boolean;
        performanceLabel: string | null;
    })[]>;
    /**
     * Get user's total points from tests
     */
    static getUserTotalPoints(userId: number): Promise<number>;
}
//# sourceMappingURL=test-services.d.ts.map