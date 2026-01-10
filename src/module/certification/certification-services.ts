import prisma from "../../common/config/database/prisma";

export class CertificationService {
  /**
   * Award certification to user when they complete a course
   * This should be called when a user finishes all lessons, tests, and quizzes
   */
  static async awardCertification(
    userId: number,
    courseId: number,
    certificateUrl?: string
  ) {
    // Check if user already has certification for this course
    const existingCert = await prisma.certification.findUnique({
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
    return prisma.certification.create({
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
  static async getUserCertifications(userId: number) {
    return prisma.certification.findMany({
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
  static async getCertificationById(certificationId: number) {
    return prisma.certification.findUnique({
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
  static async checkAndAwardCertification(
    userId: number,
    courseId: number
  ) {
    // Get course with all related data
    const course = await prisma.course.findUnique({
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
    const lessonProgress = await prisma.courseProgress.findMany({
      where: {
        userId,
        lessonId: { in: course.lessons.map((l) => l.id) },
        completed: true,
      },
    });

    const allLessonsCompleted =
      lessonProgress.length === course.lessons.length;

    // Check if all tests are passed
    const allTestsPassed = course.tests.every(
      (test) => test.attempts.length > 0
    );

    // Check if all quizzes are passed
    const allQuizzesPassed = course.quizzes.every(
      (quiz) => quiz.attempts.length > 0
    );

    // Award certification if all conditions are met
    if (allLessonsCompleted && allTestsPassed && allQuizzesPassed) {
      return await this.awardCertification(userId, courseId);
    }

    return null;
  }

  /**
   * Get certifications for a specific course
   */
  static async getCourseCertifications(courseId: number) {
    return prisma.certification.findMany({
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

