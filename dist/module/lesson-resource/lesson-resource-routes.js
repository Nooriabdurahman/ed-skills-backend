"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const lesson_resource_controllers_1 = require("./lesson-resource-controllers");
const router = (0, express_1.Router)({ mergeParams: true });
const upload = (0, multer_1.default)({ dest: "tmp/" });
// Create lesson resource (with file upload)
router.post("/", upload.single("file"), lesson_resource_controllers_1.LessonResourceController.create);
// Get all resources for a lesson
router.get("/", lesson_resource_controllers_1.LessonResourceController.getByLesson);
// Get resource by ID
router.get("/:id", lesson_resource_controllers_1.LessonResourceController.getById);
// Delete resource
router.delete("/:id", lesson_resource_controllers_1.LessonResourceController.delete);
exports.default = router;
//# sourceMappingURL=lesson-resource-routes.js.map