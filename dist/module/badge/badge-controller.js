"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeController = void 0;
const badge_services_1 = require("./badge-services");
class BadgeController {
    /**
     * Create a new badge
     */
    static async createBadge(req, res) {
        try {
            const { name, description, icon } = req.body;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Badge name is required",
                });
            }
            const badge = await badge_services_1.BadgeService.createBadge(name, description, icon);
            return res.status(201).json({
                success: true,
                data: badge,
            });
        }
        catch (error) {
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
    static async getAllBadges(req, res) {
        try {
            const badges = await badge_services_1.BadgeService.getAllBadges();
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
    /**
     * Get badge by ID
     */
    static async getBadgeById(req, res) {
        try {
            const badgeId = Number(req.params.badgeId);
            if (isNaN(badgeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid badge ID",
                });
            }
            const badge = await badge_services_1.BadgeService.getBadgeById(badgeId);
            if (!badge) {
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: "Badge not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: badge,
            });
        }
        catch (error) {
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
    static async updateBadge(req, res) {
        try {
            const badgeId = Number(req.params.badgeId);
            const { name, description, icon } = req.body;
            if (isNaN(badgeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid badge ID",
                });
            }
            const badge = await badge_services_1.BadgeService.updateBadge(badgeId, {
                name,
                description,
                icon,
            });
            return res.status(200).json({
                success: true,
                data: badge,
            });
        }
        catch (error) {
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
    static async deleteBadge(req, res) {
        try {
            const badgeId = Number(req.params.badgeId);
            if (isNaN(badgeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid badge ID",
                });
            }
            await badge_services_1.BadgeService.deleteBadge(badgeId);
            return res.status(200).json({
                success: true,
                message: "Badge deleted successfully",
            });
        }
        catch (error) {
            console.error("Error deleting badge:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error deleting badge",
            });
        }
    }
}
exports.BadgeController = BadgeController;
//# sourceMappingURL=badge-controller.js.map