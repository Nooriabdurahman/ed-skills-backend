"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class TestService {
    /**
     * Create a test for a course
     */
    static async createTest(courseId, name, description) {
        return prisma_1.default.courseTest.create({
            data: {
                courseId,
                name,
                description,
            },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
    }
    /**
     * Add a question to a test
     */
    static async addQuestion(testId, question) {
        return prisma_1.default.testQuestion.create({
            data: {
                testId,
                question,
            },
        });
    }
    /**
     * Add an answer to a test question
     */
    static async addAnswer(questionId, answer, isCorrect) {
        return prisma_1.default.testAnswer.create({
            data: {
                questionId,
                answer,
                isCorrect,
            },
        });
    }
    /**
     * Get test by ID with questions and answers
     */
    static async getTestById(testId) {
        return prisma_1.default.courseTest.findUnique({
            where: { id: testId },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    /**
     * Get all tests for a course
     */
    static async getTestsByCourse(courseId) {
        return prisma_1.default.courseTest.findMany({
            where: { courseId },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
    }
    /**
     * Submit test answers and calculate score
     * Returns points earned and creates TestAttempt and UserPoint records
     */
    static async submitTest(userId, testId, answers) {
        // Get test with all answers
        const test = await prisma_1.default.courseTest.findUnique({
            where: { id: testId },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
        if (!test) {
            throw new Error("Test not found");
        }
        // Calculate score
        let correctAnswers = 0;
        const totalQuestions = test.questions.length;
        for (const userAnswer of answers) {
            const question = test.questions.find((q) => q.id === userAnswer.questionId);
            if (question) {
                const selectedAnswer = question.answers.find((a) => a.id === userAnswer.answerId);
                if (selectedAnswer && selectedAnswer.isCorrect) {
                    correctAnswers++;
                }
            }
        }
        // Calculate points (e.g., 10 points per correct answer)
        const pointsPerQuestion = 10;
        const pointsEarned = correctAnswers * pointsPerQuestion;
        const isPassed = correctAnswers >= totalQuestions * 0.6; // 60% passing rate
        // Create test attempt
        const attempt = await prisma_1.default.testAttempt.create({
            data: {
                userId,
                testId,
                score: pointsEarned,
                totalQuestions,
                correctAnswers,
                isPassed,
            },
        });
        // Create user point record
        await prisma_1.default.userPoint.create({
            data: {
                userId,
                points: pointsEarned,
                source: "test",
                testId,
                description: `Earned ${pointsEarned} points from test: ${test.name}`,
            },
        });
        return {
            attempt,
            score: pointsEarned,
            correctAnswers,
            totalQuestions,
            isPassed,
        };
    }
    /**
     * Get user's test attempts
     */
    static async getUserTestAttempts(userId) {
        return prisma_1.default.testAttempt.findMany({
            where: { userId },
            include: {
                test: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Get user's total points from tests
     */
    static async getUserTotalPoints(userId) {
        const points = await prisma_1.default.userPoint.aggregate({
            where: {
                userId,
                source: "test",
            },
            _sum: {
                points: true,
            },
        });
        return points._sum.points || 0;
    }
}
exports.TestService = TestService;
//# sourceMappingURL=test-services.js.map