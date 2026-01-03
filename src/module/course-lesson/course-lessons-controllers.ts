import { Request, Response } from "express";
import { CourseLessonService } from "./course-lessons-services";
import { put } from "@vercel/blob";
import crypto from "crypto";
import path from "path";
import fs from "fs";

export class CourseLessonController {
  static async create(req: Request, res: Response) {
    try {
      let fileUrl: string | null = null;

      if (req.file) {
        const fileName =
          crypto.randomBytes(16).toString("hex") +
          path.extname(req.file.originalname);

        const result = await put(
          fileName,
          fs.readFileSync(req.file.path),
          {
            access: "public",
            addRandomSuffix: true,
          }
        );

        fileUrl = result.url;
        fs.unlinkSync(req.file.path);
      }

      const lesson = await CourseLessonService.create({
        ...req.body,
        fileUrl,
      });

      return res.status(201).json({
        success: true,
        data: lesson,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Could not create lesson",
      });
    }
  }

  static async getByCourse(req: Request, res: Response) {
    try {
      const courseId = req.query.courseId as string;
      if (!courseId) {
        return res.status(400).json({
          message: "courseId is required",
        });
      }

      const numericCourseId = Number(courseId);
      if (isNaN(numericCourseId)) {
        return res.status(400).json({
          message: "courseId must be a number",
        });
      }

      const lessons =
        await CourseLessonService.getByCourse(numericCourseId);

      return res.json({
        success: true,
        data: lessons,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
}
