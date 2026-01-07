import { Request, Response } from "express";
import { BadgeService } from "./badge-services";

export class BadgeController {
  /**
   * Create a new badge
   */
  static async createBadge(req: Request, res: Response) {
    try {
      const { name, description, icon } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Badge name is required",
        });
      }

      const badge = await BadgeService.createBadge(name, description, icon);

      return res.status(201).json({
        success: true,
        data: badge,
      });
    } catch (error: any) {
      console.error("Error creating badge:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error creating badge",
      });
    }
  }

  /**
   * Get all badges
   */
  static async getAllBadges(req: Request, res: Response) {
    try {
      const badges = await BadgeService.getAllBadges();

      return res.status(200).json({
        success: true,
        data: badges,
      });
    } catch (error: any) {
      console.error("Error fetching badges:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error fetching badges",
      });
    }
  }

  /**
   * Get badge by ID
   */
  static async getBadgeById(req: Request, res: Response) {
    try {
      const badgeId = Number(req.params.badgeId);

      if (isNaN(badgeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid badge ID",
        });
      }

      const badge = await BadgeService.getBadgeById(badgeId);

      if (!badge) {
        return res.status(404).json({
          success: false,
          message: "Badge not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: badge,
      });
    } catch (error: any) {
      console.error("Error fetching badge:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error fetching badge",
      });
    }
  }

  /**
   * Update badge
   */
  static async updateBadge(req: Request, res: Response) {
    try {
      const badgeId = Number(req.params.badgeId);
      const { name, description, icon } = req.body;

      if (isNaN(badgeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid badge ID",
        });
      }

      const badge = await BadgeService.updateBadge(badgeId, {
        name,
        description,
        icon,
      });

      return res.status(200).json({
        success: true,
        data: badge,
      });
    } catch (error: any) {
      console.error("Error updating badge:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error updating badge",
      });
    }
  }

  /**
   * Delete badge
   */
  static async deleteBadge(req: Request, res: Response) {
    try {
      const badgeId = Number(req.params.badgeId);

      if (isNaN(badgeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid badge ID",
        });
      }

      await BadgeService.deleteBadge(badgeId);

      return res.status(200).json({
        success: true,
        message: "Badge deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting badge:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error deleting badge",
      });
    }
  }
}

