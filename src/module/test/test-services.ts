import prisma from "../../common/config/database/prisma";

export class TestService {
  /**
   * Create a test for a course
   */
  /**
   * Create a test for a course
   */
  static async createTest(
    name: string,
    courseId?: number,
    description?: string,
    trainer?: string,
    trainerImage?: string,
    icon?: string,
    picture?: string,
    url?: string,
    topic?: string,
    materialType?: string,
    status?: string,
    type?: string,
    points?: number,
    passingPoints?: number,
    lessonId?: string
  ) {
    return prisma.courseTest.create({
      data: {
        name,
        courseId: courseId ?? null,
        description: description ?? null,
        trainer: trainer ?? null,
        trainerImage: trainerImage ?? null,
        icon: icon ?? null,
        picture: picture ?? null,
        url: url ?? null,
        topic: topic ?? null,
        materialType: materialType ?? null,
        status: status ?? null,
        type: type ?? null,
        points: points ?? null,
        passingPoints: passingPoints ?? null,
        lessonId: lessonId ?? null
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  /**
   * Add a question to a test
   */
  static async addQuestion(testId: number, question: string, type: string = "multiple_choice") {
    return prisma.testQuestion.create({
      data: {
        testId,
        question,
        type,
      },
    });
  }

  /**
   * Add an answer to a test question
   */
  static async addAnswer(questionId: number, answer: string, isCorrect: boolean) {
    return prisma.testAnswer.create({
      data: {
        questionId,
        answer,
        isCorrect,
      },
    });
  }

  /**
   * Get test by ID with questions and answers
   */
  static async getTestById(testId: number) {
    return prisma.courseTest.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Get all tests for a course
   */
  static async getTestsByCourse(courseId: number) {
    return prisma.courseTest.findMany({
      where: { courseId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  /**
   * Submit test answers and calculate score
   * Returns points earned and creates TestAttempt and UserPoint records
   */
  static async submitTest(
    userId: number,
    testId: number,
    answers: { questionId: number; answerId: number }[]
  ) {
    // Get test with all answers
    const test = await prisma.courseTest.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!test) {
      throw new Error("Test not found");
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = test.questions.length;

    for (const userAnswer of answers) {
      const question = test.questions.find((q) => q.id === userAnswer.questionId);
      if (question) {
        const selectedAnswer = question.answers.find(
          (a) => a.id === userAnswer.answerId
        );
        if (selectedAnswer && selectedAnswer.isCorrect) {
          correctAnswers++;
        }
      }
    }

    // Calculate percentage score for labeling
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Calculate points (Total 20 points for the test, distributed successfully)
    const pointsPerQuestion = totalQuestions > 0 ? (20 / totalQuestions) : 0;
    const pointsEarned = Math.round(correctAnswers * pointsPerQuestion);

    // Passing logic: usually 60% of the max score (20) -> 12 points, or simply use percentage
    const isPassed = percentage >= 60; // 60% passing rate

    // Calculate performance label
    let performanceLabel = "Failed";
    if (percentage >= 80) performanceLabel = "Excellent";
    else if (percentage >= 50) performanceLabel = "Good";
    else if (percentage >= 30) performanceLabel = "Fair";

    // Create test attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        score: pointsEarned,
        totalQuestions,
        correctAnswers,
        isPassed,
        performanceLabel,
      },
    });

    // Create user point record
    await prisma.userPoint.create({
      data: {
        userId,
        points: pointsEarned,
        source: "test",
        testId,
        description: `Earned ${pointsEarned} points from test: ${test.name}`,
      },
    });

    return {
      attempt,
      score: pointsEarned,
      percentage,
      correctAnswers,
      totalQuestions,
      isPassed,
      performanceLabel,
    };
  }

  /**
   * Get user's test attempts
   */
  static async getUserTestAttempts(userId: number) {
    return prisma.testAttempt.findMany({
      where: { userId },
      include: {
        test: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get user's total points from tests
   */
  static async getUserTotalPoints(userId: number) {
    const points = await prisma.userPoint.aggregate({
      where: {
        userId,
        source: "test",
      },
      _sum: {
        points: true,
      },
    });

    return points._sum.points || 0;
  }
}

