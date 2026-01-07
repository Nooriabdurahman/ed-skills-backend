import prisma from "../../common/config/database/prisma";

export class TestService {
  /**
   * Create a test for a course
   */
  static async createTest(courseId: number, name: string, description?: string) {
    return prisma.courseTest.create({
      data: {
        courseId,
        name,
        description,
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
  static async addQuestion(testId: number, question: string) {
    return prisma.testQuestion.create({
      data: {
        testId,
        question,
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

    // Calculate points (e.g., 10 points per correct answer)
    const pointsPerQuestion = 10;
    const pointsEarned = correctAnswers * pointsPerQuestion;
    const isPassed = correctAnswers >= totalQuestions * 0.6; // 60% passing rate

    // Create test attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        score: pointsEarned,
        totalQuestions,
        correctAnswers,
        isPassed,
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
      correctAnswers,
      totalQuestions,
      isPassed,
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

