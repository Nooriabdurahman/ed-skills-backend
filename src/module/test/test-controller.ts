import { Request, Response } from "express";
import { TestService } from "./test-services";
import { put } from '@vercel/blob';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

export class TestController {
  /**
   * Create a new test for a course
   */
  static async createTest(req: Request, res: Response) {
    try {
      const {
        courseId, name, description,
        trainer, icon,
        topic, materialType, status, type, points, passingPoints,
        lessonId
      } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "نام آزمون الزامی است",
        });
      }

      const numericCourseId = courseId ? Number(courseId) : undefined;
      if (courseId && isNaN(numericCourseId as number)) {
        return res.status(400).json({
          success: false,
          message: "شناسه دوره باید عدد باشد",
        });
      }

      // Handle file uploads
      let pictureUrl = req.body.picture;
      let trainerImageUrl = req.body.trainerImage;
      let testFileUrl = req.body.url;

      const files = (req as any).files;

      if (files) {
        if (files.picture && files.picture[0]) {
          const file = files.picture[0];
          const fileName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
          const result = await put(fileName, fs.readFileSync(file.path), { access: 'public', addRandomSuffix: true });
          pictureUrl = result.url;
          fs.unlinkSync(file.path); // Clean up
        }

        if (files.trainerImage && files.trainerImage[0]) {
          const file = files.trainerImage[0];
          const fileName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
          const result = await put(fileName, fs.readFileSync(file.path), { access: 'public', addRandomSuffix: true });
          trainerImageUrl = result.url;
          fs.unlinkSync(file.path); // Clean up
        }

        if (files.testFile && files.testFile[0]) {
          const file = files.testFile[0];
          const fileName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
          const result = await put(fileName, fs.readFileSync(file.path), { access: 'public', addRandomSuffix: true });
          testFileUrl = result.url;
          fs.unlinkSync(file.path); // Clean up
        }
      }

      const numericPoints = points ? Number(points) : undefined;
      const numericPassingPoints = passingPoints ? Number(passingPoints) : undefined;

      if ((points && isNaN(numericPoints as number)) || (passingPoints && isNaN(numericPassingPoints as number))) {
        return res.status(400).json({
          success: false,
          message: "امتیازات (points/passingPoints) باید به صورت عدد معتبر باشند",
        });
      }

      const test = await TestService.createTest(
        name,
        numericCourseId,
        description,
        trainer,
        trainerImageUrl,
        icon,
        pictureUrl,
        testFileUrl,
        topic,
        materialType,
        status,
        type,
        numericPoints,
        numericPassingPoints,
        lessonId || null
      );

      return res.status(201).json({
        success: true,
        data: test,
      });
    } catch (error: any) {
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
  static async addQuestion(req: Request, res: Response) {
    try {
      const { testId, question, type } = req.body;

      if (!testId || !question) {
        return res.status(400).json({
          success: false,
          message: "Test ID and question are required",
        });
      }

      const numericTestId = Number(testId);
      if (isNaN(numericTestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid test ID",
        });
      }

      const questionRecord = await TestService.addQuestion(numericTestId, question, type);

      return res.status(201).json({
        success: true,
        data: questionRecord,
      });
    } catch (error: any) {
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
  static async addAnswer(req: Request, res: Response) {
    try {
      const { questionId, answer, isCorrect } = req.body;

      if (!questionId || !answer || typeof isCorrect !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Question ID, answer, and isCorrect are required",
        });
      }

      const answerRecord = await TestService.addAnswer(
        questionId,
        answer,
        isCorrect
      );

      return res.status(201).json({
        success: true,
        data: answerRecord,
      });
    } catch (error: any) {
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
  static async getTestById(req: Request, res: Response) {
    try {
      const testId = Number(req.params.testId);

      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid test ID",
        });
      }

      const test = await TestService.getTestById(testId);

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
    } catch (error: any) {
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
  static async getTestsByCourse(req: Request, res: Response) {
    try {
      const courseId = Number(req.params.courseId);

      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      const tests = await TestService.getTestsByCourse(courseId);

      return res.status(200).json({
        success: true,
        data: tests,
      });
    } catch (error: any) {
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
  static async submitTest(req: Request, res: Response) {
    try {
      const { userId, testId, answers } = req.body;

      if (!userId || !testId || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: "User ID, test ID, and answers array are required",
        });
      }

      const result = await TestService.submitTest(userId, testId, answers);

      return res.status(200).json({
        success: true,
        data: result,
        message: `You earned ${result.score} points!`,
      });
    } catch (error: any) {
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
  static async getUserTestAttempts(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const attempts = await TestService.getUserTestAttempts(userId);

      return res.status(200).json({
        success: true,
        data: attempts,
      });
    } catch (error: any) {
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
  static async getUserTotalPoints(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const totalPoints = await TestService.getUserTotalPoints(userId);

      return res.status(200).json({
        success: true,
        data: { totalPoints },
      });
    } catch (error: any) {
      console.error("Error fetching total points:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error fetching total points",
      });
    }
  }
}

