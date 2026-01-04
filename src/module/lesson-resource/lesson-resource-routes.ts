import { Router } from "express";
import multer from "multer";
import { LessonResourceController } from "./lesson-resource-controllers";

const router = Router({ mergeParams: true });
const upload = multer({ dest: "tmp/" });

// Create lesson resource (with file upload)
router.post("/", upload.single("file"), LessonResourceController.create);

// Get all resources for a lesson
router.get("/", LessonResourceController.getByLesson);

// Get resource by ID
router.get("/:id", LessonResourceController.getById);

// Delete resource
router.delete("/:id", LessonResourceController.delete);

export default router;

