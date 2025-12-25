import prisma from "../../common/config/database/prisma";

export class CourseProgressService {
  static async markCompleted(userId: number, lessonId: number) {
    return prisma.courseProgress.upsert({
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

  static async getUserProgress(userId: number) {
    return prisma.courseProgress.findMany({
      where: { userId },
    });
  }
}