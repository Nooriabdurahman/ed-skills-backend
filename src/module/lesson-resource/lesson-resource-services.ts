import prisma from "../../common/config/database/prisma";
import { CreateLessonResourceDto } from "./validator/create-lesson-resource";

export class LessonResourceService {
  static async create(data: CreateLessonResourceDto & { fileUrl: string }) {
    return prisma.lessonResource.create({
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

  static async getByLesson(lessonId: string) {
    return prisma.lessonResource.findMany({
      where: { lessonId },
      orderBy: [{ createdAt: "asc" }],
    });
  }

  static async getById(id: string) {
    return prisma.lessonResource.findUnique({
      where: { id },
      include: {
        lesson: true,
      },
    });
  }

  static async delete(id: string) {
    return prisma.lessonResource.delete({
      where: { id },
    });
  }
}

