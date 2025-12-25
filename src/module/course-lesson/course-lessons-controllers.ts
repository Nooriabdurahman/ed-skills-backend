import { Request, Response } from "express";
import { CourseLessonService } from "./course-lessons-services";

export class CourseLessonController {
  static async create(req: Request, res: Response) {
    try {
      const lesson = await CourseLessonService.create(req.body);
      return res.status(201).json({ success: true, data: lesson });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Could not create lesson" });
    }
  }

  static async getByCourse(req: Request, res: Response) {
    try {
      const courseId = req.query.courseId as string; // Standardized to query or params
      if (!courseId)
        return res.status(400).json({ message: "courseId is required" });

      const numericCourseId = Number(courseId);
      if (isNaN(numericCourseId)) {
        return res.status(400).json({ message: "courseId must be a number" });
      }

      const lessons = await CourseLessonService.getByCourse(numericCourseId);
      return res.json({ success: true, data: lessons });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}