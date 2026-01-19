"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateCourse = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
const createCourse = async (data) => {
    return prisma_1.default.course.create({ data });
};
exports.createCourse = createCourse;
const getAllCourses = async () => {
    return prisma_1.default.course.findMany();
};
exports.getAllCourses = getAllCourses;
const getCourseById = async (id) => {
    return prisma_1.default.course.findUnique({ where: { id } });
};
exports.getCourseById = getCourseById;
const updateCourse = async (id, data) => {
    return prisma_1.default.course.update({ where: { id }, data });
};
exports.updateCourse = updateCourse;
const deleteCourse = async (id) => {
    return prisma_1.default.course.delete({ where: { id } });
};
exports.deleteCourse = deleteCourse;
const duplicateCourse = async (id) => {
    const originalCourse = await prisma_1.default.course.findUnique({
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
    if (!originalCourse)
        return null;
    const { id: oldId, createdAt, updatedAt, lessons, tests, quizzes, ...courseData } = originalCourse;
    const newCourse = await prisma_1.default.course.create({
        data: {
            ...courseData,
            name: `${courseData.name} (Copy)`,
            status: 'notStarted', // Reset status for the copy
        }
    });
    // Map to keep track of old lesson ID to new lesson ID for quiz linkage
    const lessonIdMap = new Map();
    // Duplicate lessons first
    for (const lesson of lessons) {
        const { id: oldLessonId, createdAt: lca, courseId: cid, ...lessonData } = lesson;
        const newLesson = await prisma_1.default.courseLesson.create({
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
        const newTest = await prisma_1.default.courseTest.create({
            data: {
                ...testData,
                courseId: newCourse.id,
            }
        });
        for (const question of questions) {
            const { id: oldQId, createdAt: qca, updatedAt: qula, testId: qtid, answers, ...questionData } = question;
            const newQuestion = await prisma_1.default.testQuestion.create({
                data: {
                    ...questionData,
                    testId: newTest.id
                }
            });
            for (const answer of answers) {
                const { id: oldAId, createdAt: aca, updatedAt: aua, questionId: aqid, ...answerData } = answer;
                await prisma_1.default.testAnswer.create({
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
        const newQuiz = await prisma_1.default.courseQuiz.create({
            data: {
                ...quizData,
                courseId: newCourse.id,
                lessonId: newLessonId,
            }
        });
        for (const question of questions) {
            const { id: oldQId, createdAt: qca2, updatedAt: qua2, quizId: qid, answers, ...questionData } = question;
            const newQuestion = await prisma_1.default.quizQuestion.create({
                data: {
                    ...questionData,
                    quizId: newQuiz.id
                }
            });
            for (const answer of answers) {
                const { id: oldAId, createdAt: aca, updatedAt: aua, questionId: aqid, ...answerData } = answer;
                await prisma_1.default.quizAnswer.create({
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
exports.duplicateCourse = duplicateCourse;
//# sourceMappingURL=course-services.js.map