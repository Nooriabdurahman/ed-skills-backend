import { Router } from "express";
import { CourseLessonController } from "./course-lessons-controllers";

const router = Router();

router.post("/new", CourseLessonController.create);
router.get("/new", CourseLessonController.getByCourse);

export default router;