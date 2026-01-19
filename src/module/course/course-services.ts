import prisma from '../../common/config/database/prisma';

export const createCourse = async (data: any) => {
  return prisma.course.create({ data });
};

export const getAllCourses = async () => {
  return prisma.course.findMany();
};

export const getCourseById = async (id: number) => {
  return prisma.course.findUnique({ where: { id } });
};

export const updateCourse = async (id: number, data: any) => {
  return prisma.course.update({ where: { id }, data });
};

export const deleteCourse = async (id: number) => {
  return prisma.course.delete({ where: { id } });
};

export const duplicateCourse = async (id: number) => {
  const originalCourse = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: true,
      tests: {
        include: {
          questions: {
            include: {
              answers: true
            }
          }
        }
      },
      quizzes: {
        include: {
          questions: {
            include: {
              answers: true
            }
          }
        }
      }
    }
  });

  if (!originalCourse) return null;

  const {
    id: oldId,
    createdAt,
    updatedAt,
    lessons,
    tests,
    quizzes,
    ...courseData
  } = originalCourse;

  const newCourse = await prisma.course.create({
    data: {
      ...courseData,
      name: `${courseData.name} (Copy)`,
      status: 'notStarted', // Reset status for the copy
    }
  });

  // Map to keep track of old lesson ID to new lesson ID for quiz linkage
  const lessonIdMap = new Map<string, string>();

  // Duplicate lessons first
  for (const lesson of lessons) {
    const { id: oldLessonId, createdAt: lca, courseId: cid, ...lessonData } = lesson;
    const newLesson = await prisma.courseLesson.create({
      data: {
        ...lessonData,
        courseId: newCourse.id,
      }
    });
    lessonIdMap.set(oldLessonId, newLesson.id);
  }

  // Duplicate tests
  for (const test of tests) {
    const { id: oldTestId, createdAt: tca, updatedAt: tua, courseId: tcid, questions, ...testData } = test;
    const newTest = await prisma.courseTest.create({
      data: {
        ...testData,
        courseId: newCourse.id,
      }
    });

    for (const question of questions) {
      const { id: oldQId, createdAt: qca, updatedAt: qula, testId: qtid, answers, ...questionData } = question;
      const newQuestion = await prisma.testQuestion.create({
        data: {
          ...questionData,
          testId: newTest.id
        }
      });

      for (const answer of answers) {
        const { id: oldAId, createdAt: aca, updatedAt: aua, questionId: aqid, ...answerData } = answer;
        await prisma.testAnswer.create({
          data: {
            ...answerData,
            questionId: newQuestion.id
          }
        });
      }
    }
  }

  // Duplicate quizzes
  for (const quiz of quizzes) {
    const { id: oldQuizId, createdAt: qca, updatedAt: qua, courseId: qcid, lessonId, questions, ...quizData } = quiz;

    // Link to new lesson if applicable
    const newLessonId = lessonId ? (lessonIdMap.get(lessonId) ?? null) : null;

    const newQuiz = await prisma.courseQuiz.create({
      data: {
        ...quizData,
        courseId: newCourse.id,
        lessonId: newLessonId,
      }
    });

    for (const question of questions) {
      const { id: oldQId, createdAt: qca2, updatedAt: qua2, quizId: qid, answers, ...questionData } = question;
      const newQuestion = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          quizId: newQuiz.id
        }
      });

      for (const answer of answers) {
        const { id: oldAId, createdAt: aca, updatedAt: aua, questionId: aqid, ...answerData } = answer;
        await prisma.quizAnswer.create({
          data: {
            ...answerData,
            questionId: newQuestion.id
          }
        });
      }
    }
  }

  return newCourse;
};

