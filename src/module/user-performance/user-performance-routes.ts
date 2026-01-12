import { Router } from "express";
import { UserPerformanceController } from "./user-performance-controllers";

const router = Router();

// Track lesson activity
router.post("/start", UserPerformanceController.startLessonActivity);
router.post("/end", UserPerformanceController.endLessonActivity);

// Get user performance stats
router.get("/stats/:userId", UserPerformanceController.getUserStats);

export default router;
