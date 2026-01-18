"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class QuizService {
    /**
     * Create a quiz for a course
     */
    static async createQuiz(courseId, name, description, badgeId, lessonId) {
        return prisma_1.default.courseQuiz.create({
            data: {
                courseId,
                name,
                description: description ?? null,
                badgeId: badgeId ?? null,
                lessonId: lessonId ?? null,
            },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                badge: true,
            },
        });
    }
    /**
     * Create a quiz with a single question and answers
     */
    static async createOneQuestionQuiz(courseId, name, questionText, answers, lessonId) {
        return prisma_1.default.courseQuiz.create({
            data: {
                courseId,
                name,
                lessonId: lessonId ?? null,
                questions: {
                    create: {
                        question: questionText,
                        answers: {
                            create: answers.map((a) => ({
                                answer: a.answer,
                                isCorrect: a.isCorrect,
                            })),
                        },
                    },
                },
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
     * Add a question to a quiz
     */
    static async addQuestion(quizId, question) {
        return prisma_1.default.quizQuestion.create({
            data: {
                quizId,
                question,
            },
        });
    }
    /**
     * Add an answer to a quiz question
     */
    static async addAnswer(questionId, answer, isCorrect) {
        return prisma_1.default.quizAnswer.create({
            data: {
                questionId,
                answer,
                isCorrect,
            },
        });
    }
    /**
     * Get quiz by ID with questions and answers
     */
    static async getQuizById(quizId) {
        return prisma_1.default.courseQuiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                badge: true,
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
     * Get all quizzes for a course
     */
    static async getQuizzesByCourse(courseId) {
        return prisma_1.default.courseQuiz.findMany({
            where: { courseId },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                badge: true,
            },
        });
    }
    /**
     * Submit quiz answers and award badge if passed
     * Returns score and badge earned (if applicable)
     */
    static async submitQuiz(userId, quizId, answers) {
        // Get quiz with all answers
        const quiz = await prisma_1.default.courseQuiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                badge: true,
            },
        });
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        // Calculate score
        let correctAnswers = 0;
        const totalQuestions = quiz.questions.length;
        for (const userAnswer of answers) {
            const question = quiz.questions.find((q) => q.id === userAnswer.questionId);
            if (question) {
                const selectedAnswer = question.answers.find((a) => a.id === userAnswer.answerId);
                if (selectedAnswer && selectedAnswer.isCorrect) {
                    correctAnswers++;
                }
            }
        }
        // Calculate score percentage
        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        const isPassed = score >= 60; // 60% passing rate
        // Calculate performance label
        let performanceLabel = "Failed";
        if (score >= 80)
            performanceLabel = "Excellent";
        else if (score >= 50)
            performanceLabel = "Good";
        else if (score >= 30)
            performanceLabel = "Fair";
        // Create quiz attempt
        const attempt = await prisma_1.default.quizAttempt.create({
            data: {
                userId,
                quizId,
                score,
                totalQuestions,
                correctAnswers,
                isPassed,
                performanceLabel,
                badgeEarned: false,
            },
        });
        // If quiz is linked to a lesson, update progress
        if (quiz.lessonId) {
            await prisma_1.default.courseProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId: quiz.lessonId,
                    },
                },
                create: {
                    userId,
                    lessonId: quiz.lessonId,
                    completed: true,
                },
                update: {
                    completed: true,
                },
            });
        }
        let badgeEarned = null;
        // Award badge if passed and quiz has a badge
        if (isPassed && quiz.badgeId && quiz.badge) {
            // Check if user already has this badge
            const existingBadge = await prisma_1.default.userBadge.findUnique({
                where: {
                    userId_badgeId: {
                        userId,
                        badgeId: quiz.badgeId,
                    },
                },
                include: {
                    badge: true,
                },
            });
            if (!existingBadge) {
                // Award badge to user
                const userBadge = await prisma_1.default.userBadge.create({
                    data: {
                        userId,
                        badgeId: quiz.badgeId,
                    },
                    include: {
                        badge: true,
                    },
                });
                badgeEarned = userBadge.badge;
                // Update attempt to reflect badge earned
                await prisma_1.default.quizAttempt.update({
                    where: { id: attempt.id },
                    data: { badgeEarned: true },
                });
            }
            else {
                badgeEarned = existingBadge.badge;
            }
        }
        return {
            attempt,
            score,
            correctAnswers,
            totalQuestions,
            isPassed,
            performanceLabel,
            badgeEarned,
        };
    }
    /**
     * Get user's quiz attempts
     */
    static async getUserQuizAttempts(userId) {
        return prisma_1.default.quizAttempt.findMany({
            where: { userId },
            include: {
                quiz: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        badge: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Get user's badges
     */
    static async getUserBadges(userId) {
        return prisma_1.default.userBadge.findMany({
            where: { userId },
            include: {
                badge: true,
            },
            orderBy: {
                earnedAt: "desc",
            },
        });
    }
}
exports.QuizService = QuizService;
//# sourceMappingURL=quiz-services.js.map