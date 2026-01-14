import { Request, Response } from "express";
import { CertificationService } from "./certification-services";

export class CertificationController {
  /**
   * Award certification to user
   */
  static async awardCertification(req: Request, res: Response) {
    try {
      const { userId, courseId, certificateUrl } = req.body;

      if (!userId || !courseId) {
        return res.status(400).json({
          success: false,
          message: "User ID and course ID are required",
        });
      }

      const certification = await CertificationService.awardCertification(
        userId,
        courseId,
        certificateUrl
      );

      return res.status(201).json({
        success: true,
        data: certification,
        message: "Certification awarded successfully!",
      });
    } catch (error: any) {
      console.error("Error awarding certification:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error awarding certification",
      });
    }
  }

  /**
   * Check and award certification if course is completed
   */
  static async checkAndAwardCertification(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.body;

      if (!userId || !courseId) {
        return res.status(400).json({
          success: false,
          message: "User ID and course ID are required",
        });
      }

      const certification =
        await CertificationService.checkAndAwardCertification(
          userId,
          courseId
        );

      if (certification) {
        return res.status(200).json({
          success: true,
          data: certification,
          message: "Congratulations! You've earned a certification!",
        });
      } else {
        return res.status(200).json({
          success: false,
          message:
            "Course not completed yet. Please complete all lessons, tests, and quizzes.",
        });
      }
    } catch (error: any) {
      console.error("Error checking certification:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error checking certification",
      });
    }
  }

  /**
   * Get user's certifications
   */
  static async getUserCertifications(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const certifications =
        await CertificationService.getUserCertifications(userId);

      return res.status(200).json({
        success: true,
        data: certifications,
      });
    } catch (error: any) {
      console.error("Error fetching certifications:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error fetching certifications",
      });
    }
  }

  /**
   * Get certification by ID
   */
  static async getCertificationById(req: Request, res: Response) {
    try {
      const certificationId = Number(req.params.certificationId);

      if (isNaN(certificationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid certification ID",
        });
      }

      const certification =
        await CertificationService.getCertificationById(certificationId);

      if (!certification) {
        return res.status(200).json({
          success: true,
          data: null,
          message: "Certification not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: certification,
      });
    } catch (error: any) {
      console.error("Error fetching certification:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error fetching certification",
      });
    }
  }

  /**
   * Get certifications for a course
   */
  static async getCourseCertifications(req: Request, res: Response) {
    try {
      const courseId = Number(req.params.courseId);

      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      const certifications =
        await CertificationService.getCourseCertifications(courseId);

      return res.status(200).json({
        success: true,
        data: certifications,
      });
    } catch (error: any) {
      console.error("Error fetching course certifications:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error fetching course certifications",
      });
    }
  }
}

