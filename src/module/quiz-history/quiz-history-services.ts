import prisma from "../../common/config/database/prisma";

export class QuizHistoryService {
    /**
     * Get quiz history for a specific user
     */
    static async getUserQuizHistory(userId: number) {
        return prisma.quizAttempt.findMany({
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
        return prisma.quizAttempt.findMany({
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
    static async getQuizHistoryByQuizId(quizId: number) {
        return prisma.quizAttempt.findMany({
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
    static async getQuizHistoryByCourseId(courseId: number) {
        return prisma.quizAttempt.findMany({
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
