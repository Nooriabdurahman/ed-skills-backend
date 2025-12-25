"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class CourseProgressService {
    static async markCompleted(userId, lessonId) {
        return prisma_1.default.courseProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            update: {
                completed: true,
            },
            create: {
                userId,
                lessonId,
                completed: true,
            },
        });
    }
    static async getUserProgress(userId) {
        return prisma_1.default.courseProgress.findMany({
            where: { userId },
        });
    }
}
exports.CourseProgressService = CourseProgressService;
//# sourceMappingURL=progress-services.js.map