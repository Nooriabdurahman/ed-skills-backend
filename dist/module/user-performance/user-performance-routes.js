"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_performance_controllers_1 = require("./user-performance-controllers");
const router = (0, express_1.Router)();
// Track lesson activity
router.post("/start", user_performance_controllers_1.UserPerformanceController.startLessonActivity);
router.post("/end", user_performance_controllers_1.UserPerformanceController.endLessonActivity);
// Get user performance stats
router.get("/stats/:userId", user_performance_controllers_1.UserPerformanceController.getUserStats);
exports.default = router;
//# sourceMappingURL=user-performance-routes.js.map