import { Request, Response } from "express";
import { CourseProgressService } from "./progress-services";

export class CourseProgressController {
  // Use instance methods or keep static, but be consistent
  static async markCompleted(req: Request, res: Response) {
    try {
      const { userId, lessonId } = req.body;
      const progress = await CourseProgressService.markCompleted(
        userId,
        lessonId
      );

      return res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  static async getUserProgress(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
      const progress = await CourseProgressService.getUserProgress(userId);
      return res.json({ success: true, data: progress });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error fetching progress" });
    }
  }
}