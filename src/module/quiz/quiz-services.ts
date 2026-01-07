import prisma from "../../common/config/database/prisma";

export class QuizService {
  /**
   * Create a quiz for a course
   */
  static async createQuiz(
    courseId: number,
    name: string,
    description?: string,
    badgeId?: number
  ) {
    return prisma.courseQuiz.create({
      data: {
        courseId,
        name,
        description,
        badgeId,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        badge: true,
      },
    });
  }

  /**
   * Add a question to a quiz
   */
  static async addQuestion(quizId: number, question: string) {
    return prisma.quizQuestion.create({
      data: {
        quizId,
        question,
      },
    });
  }

  /**
   * Add an answer to a quiz question
   */
  static async addAnswer(questionId: number, answer: string, isCorrect: boolean) {
    return prisma.quizAnswer.create({
      data: {
        questionId,
        answer,
        isCorrect,
      },
    });
  }

  /**
   * Get quiz by ID with questions and answers
   */
  static async getQuizById(quizId: number) {
    return prisma.courseQuiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        badge: true,
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
   * Get all quizzes for a course
   */
  static async getQuizzesByCourse(courseId: number) {
    return prisma.courseQuiz.findMany({
      where: { courseId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        badge: true,
      },
    });
  }

  /**
   * Submit quiz answers and award badge if passed
   * Returns score and badge earned (if applicable)
   */
  static async submitQuiz(
    userId: number,
    quizId: number,
    answers: { questionId: number; answerId: number }[]
  ) {
    // Get quiz with all answers
    const quiz = await prisma.courseQuiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        badge: true,
      },
    });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    for (const userAnswer of answers) {
      const question = quiz.questions.find((q) => q.id === userAnswer.questionId);
      if (question) {
        const selectedAnswer = question.answers.find(
          (a) => a.id === userAnswer.answerId
        );
        if (selectedAnswer && selectedAnswer.isCorrect) {
          correctAnswers++;
        }
      }
    }

    // Calculate score percentage
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = score >= 60; // 60% passing rate

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        totalQuestions,
        correctAnswers,
        isPassed,
        badgeEarned: false,
      },
    });

    let badgeEarned = null;

    // Award badge if passed and quiz has a badge
    if (isPassed && quiz.badgeId && quiz.badge) {
      // Check if user already has this badge
      const existingBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId: quiz.badgeId,
          },
        },
        include: {
          badge: true,
        },
      });

      if (!existingBadge) {
        // Award badge to user
        const userBadge = await prisma.userBadge.create({
          data: {
            userId,
            badgeId: quiz.badgeId,
          },
          include: {
            badge: true,
          },
        });

        badgeEarned = userBadge.badge;

        // Update attempt to reflect badge earned
        await prisma.quizAttempt.update({
          where: { id: attempt.id },
          data: { badgeEarned: true },
        });
      } else {
        badgeEarned = existingBadge.badge;
      }
    }

    return {
      attempt,
      score,
      correctAnswers,
      totalQuestions,
      isPassed,
      badgeEarned,
    };
  }

  /**
   * Get user's quiz attempts
   */
  static async getUserQuizAttempts(userId: number) {
    return prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
              },
            },
            badge: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get user's badges
   */
  static async getUserBadges(userId: number) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: {
        earnedAt: "desc",
      },
    });
  }
}

