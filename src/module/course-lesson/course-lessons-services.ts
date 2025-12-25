import prisma from "../../common/config/database/prisma";
import { CreateCourseLessonDto } from "./validator/create-course-lesson";

export class CourseLessonService {
  static async create(data: CreateCourseLessonDto) {
    return prisma.courseLesson.create({
      data: {
        ...data,
        courseId: Number(data.courseId),
      },
    });
  }

  static async getByCourse(courseId: number) {
    return prisma.courseLesson.findMany({
      where: { courseId },
    });
  }
}