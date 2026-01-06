import prisma from "../../common/config/database/prisma";

export class CourseHistoryService {
  /**
   * Track when a user views a course
   * If the user has already viewed the course, update the viewedAt timestamp
   */
  static async trackCourseView(userId: number, courseId: number) {
    return prisma.courseHistory.upsert({
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
  static async getUserCourseHistory(userId: number) {
    return prisma.courseHistory.findMany({
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
  static async hasUserViewedCourse(userId: number, courseId: number) {
    const history = await prisma.courseHistory.findUnique({
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
  static async getCourseViewers(courseId: number) {
    return prisma.courseHistory.findMany({
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

