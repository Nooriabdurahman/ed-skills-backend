import { Router } from "express";
import multer from "multer";
import { CourseLessonController } from "./course-lessons-controllers";
import lessonResourceRoutes from "../lesson-resource/lesson-resource-routes";

const router = Router({ mergeParams: true });
const upload = multer({ dest: "tmp/" });

// Course lessons routes
router.post("/", upload.single("video"), CourseLessonController.create);
router.get("/", CourseLessonController.getByCourse);

// Nested lesson resources routes
router.use("/:lessonId/resources", lessonResourceRoutes);

export default router;