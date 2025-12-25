"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("./progress-controller");
const prograss_validation_1 = require("./validatror/prograss-validation");
const router = (0, express_1.Router)();
// Professional tip: routes should be clean. The "/course-progress" prefix
// should be in your main app.ts
router.post("/", prograss_validation_1.validateCreateProgress, progress_controller_1.CourseProgressController.markCompleted);
router.get("/:userId", progress_controller_1.CourseProgressController.getUserProgress);
exports.default = router;
//# sourceMappingURL=progress-routes.js.map