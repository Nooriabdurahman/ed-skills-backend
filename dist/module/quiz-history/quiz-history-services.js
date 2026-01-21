"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizHistoryService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class QuizHistoryService {
    /**
     * Get quiz history for a specific user
     */
    static async getUserQuizHistory(userId) {
        return prisma_1.default.quizAttempt.findMany({
            where: { userId },
            include: {
                quiz: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                name: true,
                                subject: true,
                            },
                        },
                        lesson: {
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
     * Get all quiz attempts (admin)
     */
    static async getAllQuizHistory() {
        return prisma_1.default.quizAttempt.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
                quiz: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                name: true,
                                subject: true,
                            },
                        },
                        lesson: {
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
     * Get quiz history for a specific quiz
     */
    static async getQuizHistoryByQuizId(quizId) {
        return prisma_1.default.quizAttempt.findMany({
            where: { quizId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Get quiz history for a specific course
     */
    static async getQuizHistoryByCourseId(courseId) {
        return prisma_1.default.quizAttempt.findMany({
            where: {
                quiz: {
                    courseId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
                quiz: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.QuizHistoryService = QuizHistoryService;
//# sourceMappingURL=quiz-history-services.js.map