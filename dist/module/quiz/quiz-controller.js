"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const quiz_services_1 = require("./quiz-services");
class QuizController {
    /**
     * Create a new quiz for a course
     */
    static async createQuiz(req, res) {
        try {
            const { courseId, name, description, badgeId } = req.body;
            if (!courseId || !name) {
                return res.status(400).json({
                    success: false,
                    message: "Course ID and quiz name are required",
                });
            }
            const quiz = await quiz_services_1.QuizService.createQuiz(courseId, name, description, badgeId);
            return res.status(201).json({
                success: true,
                data: quiz,
            });
        }
        catch (error) {
            console.error("Error creating quiz:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error creating quiz",
            });
        }
    }
    /**
     * Add a question to a quiz
     */
    static async addQuestion(req, res) {
        try {
            const { quizId, question } = req.body;
            if (!quizId || !question) {
                return res.status(400).json({
                    success: false,
                    message: "Quiz ID and question are required",
                });
            }
            const questionRecord = await quiz_services_1.QuizService.addQuestion(quizId, question);
            return res.status(201).json({
                success: true,
                data: questionRecord,
            });
        }
        catch (error) {
            console.error("Error adding question:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error adding question",
            });
        }
    }
    /**
     * Add an answer to a question
     */
    static async addAnswer(req, res) {
        try {
            const { questionId, answer, isCorrect } = req.body;
            if (!questionId || !answer || typeof isCorrect !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: "Question ID, answer, and isCorrect are required",
                });
            }
            const answerRecord = await quiz_services_1.QuizService.addAnswer(questionId, answer, isCorrect);
            return res.status(201).json({
                success: true,
                data: answerRecord,
            });
        }
        catch (error) {
            console.error("Error adding answer:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error adding answer",
            });
        }
    }
    /**
     * Get quiz by ID
     */
    static async getQuizById(req, res) {
        try {
            const quizId = Number(req.params.quizId);
            if (isNaN(quizId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quiz ID",
                });
            }
            const quiz = await quiz_services_1.QuizService.getQuizById(quizId);
            if (!quiz) {
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: "Quiz not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: quiz,
            });
        }
        catch (error) {
            console.error("Error fetching quiz:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching quiz",
            });
        }
    }
    /**
     * Get all quizzes for a course
     */
    static async getQuizzesByCourse(req, res) {
        try {
            const courseId = Number(req.params.courseId);
            if (isNaN(courseId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid course ID",
                });
            }
            const quizzes = await quiz_services_1.QuizService.getQuizzesByCourse(courseId);
            return res.status(200).json({
                success: true,
                data: quizzes,
            });
        }
        catch (error) {
            console.error("Error fetching quizzes:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching quizzes",
            });
        }
    }
    /**
     * Submit quiz answers and get badge
     */
    static async submitQuiz(req, res) {
        try {
            const { userId, quizId, answers } = req.body;
            if (!userId || !quizId || !Array.isArray(answers)) {
                return res.status(400).json({
                    success: false,
                    message: "User ID, quiz ID, and answers array are required",
                });
            }
            const result = await quiz_services_1.QuizService.submitQuiz(userId, quizId, answers);
            const message = result.badgeEarned
                ? `Congratulations! You passed and earned the "${result.badgeEarned.name}" badge!`
                : result.isPassed
                    ? "Congratulations! You passed the quiz!"
                    : "You didn't pass this time. Try again!";
            return res.status(200).json({
                success: true,
                data: result,
                message,
            });
        }
        catch (error) {
            console.error("Error submitting quiz:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error submitting quiz",
            });
        }
    }
    /**
     * Get user's quiz attempts
     */
    static async getUserQuizAttempts(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }
            const attempts = await quiz_services_1.QuizService.getUserQuizAttempts(userId);
            return res.status(200).json({
                success: true,
                data: attempts,
            });
        }
        catch (error) {
            console.error("Error fetching quiz attempts:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching quiz attempts",
            });
        }
    }
    /**
     * Get user's badges
     */
    static async getUserBadges(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }
            const badges = await quiz_services_1.QuizService.getUserBadges(userId);
            return res.status(200).json({
                success: true,
                data: badges,
            });
        }
        catch (error) {
            console.error("Error fetching badges:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching badges",
            });
        }
    }
}
exports.QuizController = QuizController;
//# sourceMappingURL=quiz-controller.js.map