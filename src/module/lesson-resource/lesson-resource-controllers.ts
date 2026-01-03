import { Request, Response } from "express";
import { LessonResourceService } from "./lesson-resource-services";
import { put } from "@vercel/blob";
import crypto from "crypto";
import path from "path";
import fs from "fs";

export class LessonResourceController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "File is required",
        });
      }

      const fileName =
        crypto.randomBytes(16).toString("hex") +
        path.extname(req.file.originalname);

      // Upload to Vercel Blob
      const result = await put(fileName, fs.readFileSync(req.file.path), {
        access: "public",
        addRandomSuffix: true,
      });

      const fileUrl = result.url;
      fs.unlinkSync(req.file.path);

      // Get file type from extension
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const fileType = fileExtension.replace(".", "") || "unknown";

      const resource = await LessonResourceService.create({
        name: req.body.name || req.file.originalname,
        description: req.body.description,
        lessonId: req.body.lessonId,
        fileUrl,
        fileType,
        fileSize: req.file.size,
      });

      return res.status(201).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Could not create lesson resource",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getByLesson(req: Request, res: Response) {
    try {
      const lessonId = req.query.lessonId as string;
      if (!lessonId) {
        return res.status(400).json({
          success: false,
          message: "lessonId is required",
        });
      }

      const resources = await LessonResourceService.getByLesson(lessonId);

      return res.json({
        success: true,
        data: resources,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Resource id is required",
        });
      }

      const resource = await LessonResourceService.getById(id);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      return res.json({
        success: true,
        data: resource,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Resource id is required",
        });
      }

      await LessonResourceService.delete(id);

      return res.json({
        success: true,
        message: "Resource deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
}

