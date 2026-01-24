export declare class TestService {
    /**
     * Create a test for a course
     */
    /**
     * Create a test for a course
     */
    static createTest(courseId: number, name: string, description?: string, trainer?: string, trainerImage?: string, icon?: string, picture?: string, url?: string, topic?: string, materialType?: string, status?: string, type?: string, points?: number, passingPoints?: number, lessonId?: string): Promise<{
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
            type: string;
            question: string;
            testId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        points: number | null;
        name: string;
        description: string | null;
        icon: string | null;
        picture: string | null;
        materialType: string | null;
        status: string | null;
        updatedAt: Date;
        topic: string | null;
        trainer: string | null;
        trainerImage: string | null;
        passingPoints: number | null;
        type: string | null;
        url: string | null;
        courseId: number;
        lessonId: string | null;
    }>;
    /**
     * Add a question to a test
     */
    static addQuestion(testId: number, question: string, type?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: string;
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
            type: string;
            question: string;
            testId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        points: number | null;
        name: string;
        description: string | null;
        icon: string | null;
        picture: string | null;
        materialType: string | null;
        status: string | null;
        updatedAt: Date;
        topic: string | null;
        trainer: string | null;
        trainerImage: string | null;
        passingPoints: number | null;
        type: string | null;
        url: string | null;
        courseId: number;
        lessonId: string | null;
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
            type: string;
            question: string;
            testId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        points: number | null;
        name: string;
        description: string | null;
        icon: string | null;
        picture: string | null;
        materialType: string | null;
        status: string | null;
        updatedAt: Date;
        topic: string | null;
        trainer: string | null;
        trainerImage: string | null;
        passingPoints: number | null;
        type: string | null;
        url: string | null;
        courseId: number;
        lessonId: string | null;
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
            points: number | null;
            name: string;
            description: string | null;
            icon: string | null;
            picture: string | null;
            materialType: string | null;
            status: string | null;
            updatedAt: Date;
            topic: string | null;
            trainer: string | null;
            trainerImage: string | null;
            passingPoints: number | null;
            type: string | null;
            url: string | null;
            courseId: number;
            lessonId: string | null;
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