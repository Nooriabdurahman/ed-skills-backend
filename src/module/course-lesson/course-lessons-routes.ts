import { Router } from "express";
import { CourseLessonController } from "./course-lessons-controllers";

const router = Router();

router.post("/", CourseLessonController.create);
router.get("/", CourseLessonController.getByCourse);

export default router;