import { Router } from "express";
import { CourseProgressController } from "./progress-controller";
import { validateCreateProgress } from "./validatror/prograss-validation";

const router = Router();

// Professional tip: routes should be clean. The "/course-progress" prefix
// should be in your main app.ts
router.post(
  "/",
  validateCreateProgress,
  CourseProgressController.markCompleted
);
router.get("/:userId", CourseProgressController.getUserProgress);

export default router;