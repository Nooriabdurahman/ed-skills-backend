"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const course_lessons_controllers_1 = require("./course-lessons-controllers");
const lesson_resource_routes_1 = __importDefault(require("../lesson-resource/lesson-resource-routes"));
const router = (0, express_1.Router)({ mergeParams: true });
const upload = (0, multer_1.default)({ dest: "tmp/" });
// Course lessons routes
router.post("/", upload.single("video"), course_lessons_controllers_1.CourseLessonController.create);
router.get("/", course_lessons_controllers_1.CourseLessonController.getByCourse);
// Nested lesson resources routes
router.use("/:lessonId/resources", lesson_resource_routes_1.default);
exports.default = router;
//# sourceMappingURL=course-lessons-routes.js.map