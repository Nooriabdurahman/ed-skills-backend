"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationService = void 0;
const prisma_1 = __importDefault(require("../../../common/config/database/prisma"));
class CertificationService {
    /**
     * Award certification to user when they complete a course
     * This should be called when a user finishes all lessons, tests, and quizzes
     */
    static async awardCertification(userId, courseId, certificateUrl) {
        // Check if user already has certification for this course
        const existingCert = await prisma_1.default.certification.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        if (existingCert) {
            return existingCert;
        }
        // Create certification
        return prisma_1.default.certification.create({
            data: {
                userId,
                courseId,
                // Prisma expects `string | null`, not `string | undefined`
                certificateUrl: certificateUrl ?? null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
    }
    /**
     * Get user's certifications
     */
    static async getUserCertifications(userId) {
        return prisma_1.default.certification.findMany({
            where: { userId },
            include: {
                course: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        picture: true,
                        subject: true,
                    },
                },
            },
            orderBy: {
                issuedAt: "desc",
            },
        });
    }
    /**
     * Get certification by ID
     */
    static async getCertificationById(certificationId) {
        return prisma_1.default.certification.findUnique({
            where: { id: certificationId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePicture: true,
                    },
                },
                course: true,
            },
        });
    }
    /**
     * Check if user has completed course and award certification
     * This checks if user has:
     * - Completed all lessons
     * - Passed all tests
     * - Passed all quizzes
     */
    static async checkAndAwardCertification(userId, courseId) {
        // Get course with all related data
        const course = await prisma_1.default.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: true,
                tests: {
                    include: {
                        attempts: {
                            where: { userId, isPassed: true },
                        },
                    },
                },
                quizzes: {
                    include: {
                        attempts: {
                            where: { userId, isPassed: true },
                        },
                    },
                },
            },
        });
        if (!course) {
            throw new Error("Course not found");
        }
        // Check if all lessons are completed
        const lessonProgress = await prisma_1.default.courseProgress.findMany({
            where: {
                userId,
                lessonId: { in: course.lessons.map((l) => l.id) },
                completed: true,
            },
        });
        const allLessonsCompleted = lessonProgress.length === course.lessons.length;
        // Check if all tests are passed
        const allTestsPassed = course.tests.every((test) => test.attempts.length > 0);
        // Check if all quizzes are passed
        const allQuizzesPassed = course.quizzes.every((quiz) => quiz.attempts.length > 0);
        // Award certification if all conditions are met
        if (allLessonsCompleted && allTestsPassed && allQuizzesPassed) {
            return await this.awardCertification(userId, courseId);
        }
        return null;
    }
    /**
     * Get certifications for a specific course
     */
    static async getCourseCertifications(courseId) {
        return prisma_1.default.certification.findMany({
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
                issuedAt: "desc",
            },
        });
    }
}
exports.CertificationService = CertificationService;
//# sourceMappingURL=certification-services.js.map