"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseLessonService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class CourseLessonService {
    static async create(data) {
        return prisma_1.default.courseLesson.create({
            data: {
                ...data,
                courseId: Number(data.courseId),
            },
        });
    }
    static async getByCourse(courseId) {
        return prisma_1.default.courseLesson.findMany({
            where: { courseId },
        });
    }
}
exports.CourseLessonService = CourseLessonService;
//# sourceMappingURL=course-lessons-services.js.map