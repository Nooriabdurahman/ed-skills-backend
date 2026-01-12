import { Request, Response } from "express";
import { UserPerformanceService } from "./user-performance-services";

export class UserPerformanceController {
    /**
     * Start lesson activity
     */
    static async startLessonActivity(req: Request, res: Response) {
        try {
            const { userId, lessonId } = req.body;

            if (!userId || !lessonId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID and Lesson ID are required",
                });
            }

            const activity = await UserPerformanceService.startLessonActivity(
                Number(userId),
                lessonId
            );

            return res.status(201).json({
                success: true,
                data: activity,
            });
        } catch (error: any) {
            console.error("Error starting lesson activity:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error starting lesson activity",
            });
        }
    }

    /**
     * End lesson activity
     */
    static async endLessonActivity(req: Request, res: Response) {
        try {
            const { activityId } = req.body;

            if (!activityId) {
                return res.status(400).json({
                    success: false,
                    message: "Activity ID is required",
                });
            }

            const activity = await UserPerformanceService.endLessonActivity(
                Number(activityId)
            );

            return res.status(200).json({
                success: true,
                data: activity,
            });
        } catch (error: any) {
            console.error("Error ending lesson activity:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error ending lesson activity",
            });
        }
    }

    /**
     * Get user stats
     */
    static async getUserStats(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId);

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }

            const stats = await UserPerformanceService.getUserStats(userId);

            return res.status(200).json({
                success: true,
                data: stats,
            });
        } catch (error: any) {
            console.error("Error fetching user stats:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching user stats",
            });
        }
    }
}
