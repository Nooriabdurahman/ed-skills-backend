"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_lessons_controllers_1 = require("./course-lessons-controllers");
const router = (0, express_1.Router)();
router.post("/", course_lessons_controllers_1.CourseLessonController.create);
router.get("/", course_lessons_controllers_1.CourseLessonController.getByCourse);
exports.default = router;
//# sourceMappingURL=course-lessons-routes.js.map