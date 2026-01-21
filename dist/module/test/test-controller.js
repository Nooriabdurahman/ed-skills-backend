"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const test_services_1 = require("./test-services");
const blob_1 = require("@vercel/blob");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class TestController {
    /**
     * Create a new test for a course
     */
    static async createTest(req, res) {
        try {
            const { courseId, name, description, trainer, icon, topic, materialType, status, type, points, passingPoints } = req.body;
            if (!courseId || !name) {
                return res.status(400).json({
                    success: false,
                    message: "Course ID and test name are required",
                });
            }
            // Handle file uploads
            let pictureUrl = req.body.picture;
            let trainerImageUrl = req.body.trainerImage;
            const files = req.files;
            if (files) {
                if (files.picture && files.picture[0]) {
                    const file = files.picture[0];
                    const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(file.originalname);
                    const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(file.path), { access: 'public', addRandomSuffix: true });
                    pictureUrl = result.url;
                    fs_1.default.unlinkSync(file.path); // Clean up
                }
                if (files.trainerImage && files.trainerImage[0]) {
                    const file = files.trainerImage[0];
                    const fileName = crypto_1.default.randomBytes(16).toString('hex') + path_1.default.extname(file.originalname);
                    const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(file.path), { access: 'public', addRandomSuffix: true });
                    trainerImageUrl = result.url;
                    fs_1.default.unlinkSync(file.path); // Clean up
                }
            }
            const test = await test_services_1.TestService.createTest(Number(courseId), name, description, trainer, trainerImageUrl, icon, pictureUrl, topic, materialType, status, type, Number(points), Number(passingPoints));
            return res.status(201).json({
                success: true,
                data: test,
            });
        }
        catch (error) {
            console.error("Error creating test:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error creating test",
            });
        }
    }
    /**
     * Add a question to a test
     */
    static async addQuestion(req, res) {
        try {
            const { testId, question } = req.body;
            if (!testId || !question) {
                return res.status(400).json({
                    success: false,
                    message: "Test ID and question are required",
                });
            }
            const questionRecord = await test_services_1.TestService.addQuestion(testId, question);
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
            const answerRecord = await test_services_1.TestService.addAnswer(questionId, answer, isCorrect);
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
     * Get test by ID
     */
    static async getTestById(req, res) {
        try {
            const testId = Number(req.params.testId);
            if (isNaN(testId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid test ID",
                });
            }
            const test = await test_services_1.TestService.getTestById(testId);
            if (!test) {
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: "Test not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: test,
            });
        }
        catch (error) {
            console.error("Error fetching test:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching test",
            });
        }
    }
    /**
     * Get all tests for a course
     */
    static async getTestsByCourse(req, res) {
        try {
            const courseId = Number(req.params.courseId);
            if (isNaN(courseId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid course ID",
                });
            }
            const tests = await test_services_1.TestService.getTestsByCourse(courseId);
            return res.status(200).json({
                success: true,
                data: tests,
            });
        }
        catch (error) {
            console.error("Error fetching tests:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching tests",
            });
        }
    }
    /**
     * Submit test answers
     */
    static async submitTest(req, res) {
        try {
            const { userId, testId, answers } = req.body;
            if (!userId || !testId || !Array.isArray(answers)) {
                return res.status(400).json({
                    success: false,
                    message: "User ID, test ID, and answers array are required",
                });
            }
            const result = await test_services_1.TestService.submitTest(userId, testId, answers);
            return res.status(200).json({
                success: true,
                data: result,
                message: `You earned ${result.score} points!`,
            });
        }
        catch (error) {
            console.error("Error submitting test:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error submitting test",
            });
        }
    }
    /**
     * Get user's test attempts
     */
    static async getUserTestAttempts(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }
            const attempts = await test_services_1.TestService.getUserTestAttempts(userId);
            return res.status(200).json({
                success: true,
                data: attempts,
            });
        }
        catch (error) {
            console.error("Error fetching test attempts:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching test attempts",
            });
        }
    }
    /**
     * Get user's total points
     */
    static async getUserTotalPoints(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }
            const totalPoints = await test_services_1.TestService.getUserTotalPoints(userId);
            return res.status(200).json({
                success: true,
                data: { totalPoints },
            });
        }
        catch (error) {
            console.error("Error fetching total points:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching total points",
            });
        }
    }
}
exports.TestController = TestController;
//# sourceMappingURL=test-controller.js.map