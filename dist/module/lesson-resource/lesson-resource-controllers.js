"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonResourceController = void 0;
const lesson_resource_services_1 = require("./lesson-resource-services");
const blob_1 = require("@vercel/blob");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class LessonResourceController {
    static async create(req, res) {
        try {
            const { lessonId } = req.params;
            if (!lessonId) {
                return res.status(400).json({
                    success: false,
                    message: "lessonId is required",
                });
            }
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "File is required",
                });
            }
            const fileName = crypto_1.default.randomBytes(16).toString("hex") +
                path_1.default.extname(req.file.originalname);
            // Upload to Vercel Blob
            const result = await (0, blob_1.put)(fileName, fs_1.default.readFileSync(req.file.path), {
                access: "public",
                addRandomSuffix: true,
            });
            const fileUrl = result.url;
            fs_1.default.unlinkSync(req.file.path);
            // Get file type from extension
            const fileExtension = path_1.default.extname(req.file.originalname).toLowerCase();
            const fileType = fileExtension.replace(".", "") || "unknown";
            const resource = await lesson_resource_services_1.LessonResourceService.create({
                name: req.body.name || req.file.originalname,
                description: req.body.description,
                lessonId,
                fileUrl,
                fileType,
                fileSize: req.file.size,
            });
            return res.status(201).json({
                success: true,
                data: resource,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: "Could not create lesson resource",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async getByLesson(req, res) {
        try {
            const { lessonId } = req.params;
            if (!lessonId) {
                return res.status(400).json({
                    success: false,
                    message: "lessonId is required",
                });
            }
            const resources = await lesson_resource_services_1.LessonResourceService.getByLesson(lessonId);
            return res.json({
                success: true,
                data: resources,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Resource id is required",
                });
            }
            const resource = await lesson_resource_services_1.LessonResourceService.getById(id);
            if (!resource) {
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: "Resource not found",
                });
            }
            return res.json({
                success: true,
                data: resource,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Resource id is required",
                });
            }
            await lesson_resource_services_1.LessonResourceService.delete(id);
            return res.json({
                success: true,
                message: "Resource deleted successfully",
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
}
exports.LessonResourceController = LessonResourceController;
//# sourceMappingURL=lesson-resource-controllers.js.map