"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseHistoryService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class CourseHistoryService {
    /**
     * Track when a user views a course
     * If the user has already viewed the course, update the viewedAt timestamp
     */
    static async trackCourseView(userId, courseId) {
        return prisma_1.default.courseHistory.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            update: {
                viewedAt: new Date(),
            },
            create: {
                userId,
                courseId,
                viewedAt: new Date(),
            },
        });
    }
    /**
     * Get all courses that a user has viewed (their course history)
     */
    static async getUserCourseHistory(userId) {
        return prisma_1.default.courseHistory.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        lessons: {
                            orderBy: { createdAt: "asc" },
                        },
                    },
                },
            },
            orderBy: {
                viewedAt: "desc", // Most recently viewed first
            },
        });
    }
    /**
     * Check if a user has viewed a specific course
     */
    static async hasUserViewedCourse(userId, courseId) {
        const history = await prisma_1.default.courseHistory.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        return !!history;
    }
    /**
     * Get course history for a specific course (all users who viewed it)
     */
    static async getCourseViewers(courseId) {
        return prisma_1.default.courseHistory.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: {
                viewedAt: "desc",
            },
        });
    }
}
exports.CourseHistoryService = CourseHistoryService;
//# sourceMappingURL=course-history-services.js.map