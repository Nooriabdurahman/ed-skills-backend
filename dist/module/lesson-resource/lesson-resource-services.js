"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonResourceService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class LessonResourceService {
    static async create(data) {
        return prisma_1.default.lessonResource.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                fileUrl: data.fileUrl,
                fileType: data.fileType ?? null,
                fileSize: data.fileSize ?? null,
                lessonId: data.lessonId,
            },
        });
    }
    static async getByLesson(lessonId) {
        return prisma_1.default.lessonResource.findMany({
            where: { lessonId },
            orderBy: [{ createdAt: "asc" }],
        });
    }
    static async getById(id) {
        return prisma_1.default.lessonResource.findUnique({
            where: { id },
            include: {
                lesson: true,
            },
        });
    }
    static async delete(id) {
        return prisma_1.default.lessonResource.delete({
            where: { id },
        });
    }
}
exports.LessonResourceService = LessonResourceService;
//# sourceMappingURL=lesson-resource-services.js.map