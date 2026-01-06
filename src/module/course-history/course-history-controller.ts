import { Request, Response } from "express";
import { CourseHistoryService } from "./course-history-services";
import { AuthRequest } from "../../common/midlewere/auth";

export class CourseHistoryController {
  /**
   * Track when a user views a course
   * POST /course-history
   * Body: { courseId: number }
   */
  static async trackCourseView(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - User not authenticated",
        });
      }

      const { courseId } = req.body;
      if (!courseId || isNaN(Number(courseId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid courseId",
        });
      }

      const history = await CourseHistoryService.trackCourseView(
        userId,
        Number(courseId)
      );

      return res.status(200).json({
        success: true,
        data: history,
        message: "Course view tracked successfully",
      });
    } catch (error) {
      console.error("Error tracking course view:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  /**
   * Get all courses that the authenticated user has viewed
   * GET /course-history/my-history
   */
  static async getMyCourseHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - User not authenticated",
        });
      }

      const history = await CourseHistoryService.getUserCourseHistory(userId);

      return res.status(200).json({
        success: true,
        data: history,
        count: history.length,
      });
    } catch (error) {
      console.error("Error fetching course history:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  /**
   * Get course history for a specific user
   * GET /course-history/user/:userId
   */
  static async getUserCourseHistory(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid User ID",
        });
      }

      const history = await CourseHistoryService.getUserCourseHistory(userId);

      return res.status(200).json({
        success: true,
        data: history,
        count: history.length,
      });
    } catch (error) {
      console.error("Error fetching user course history:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  /**
   * Check if user has viewed a specific course
   * GET /course-history/check/:courseId
   */
  static async checkCourseViewed(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - User not authenticated",
        });
      }

      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Course ID",
        });
      }

      const hasViewed = await CourseHistoryService.hasUserViewedCourse(
        userId,
        courseId
      );

      return res.status(200).json({
        success: true,
        data: { hasViewed, userId, courseId },
      });
    } catch (error) {
      console.error("Error checking course view:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  /**
   * Get all users who viewed a specific course
   * GET /course-history/course/:courseId/viewers
   */
  static async getCourseViewers(req: Request, res: Response) {
    try {
      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Course ID",
        });
      }

      const viewers = await CourseHistoryService.getCourseViewers(courseId);

      return res.status(200).json({
        success: true,
        data: viewers,
        count: viewers.length,
      });
    } catch (error) {
      console.error("Error fetching course viewers:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}

