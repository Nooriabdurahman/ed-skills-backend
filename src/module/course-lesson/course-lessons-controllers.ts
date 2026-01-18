import { Request, Response } from "express";
import { CourseLessonService } from "./course-lessons-services";
import { put } from "@vercel/blob";
import crypto from "crypto";
import path from "path";
import fs from "fs";

export class CourseLessonController {
  static async create(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        return res.status(400).json({ success: false, message: "courseId is required" });
      }

      let video: string | null = null;
      let file: string | null = null;
      let fileType: string | null = null;
      let fileSize: number | null = null;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      if (files?.video?.[0]) {
        const fileName =
          crypto.randomBytes(16).toString("hex") + path.extname(files.video[0].originalname);
        const result = await put(fileName, fs.readFileSync(files.video[0].path), {
          access: "public",
          addRandomSuffix: true,
        });
        video = result.url;
        fs.unlinkSync(files.video[0].path);
      }

      if (files?.file?.[0]) {
        const fileName =
          crypto.randomBytes(16).toString("hex") + path.extname(files.file[0].originalname);
        const result = await put(fileName, fs.readFileSync(files.file[0].path), {
          access: "public",
          addRandomSuffix: true,
        });
        file = result.url;
        fileType = files.file[0].mimetype;
        fileSize = files.file[0].size;
        fs.unlinkSync(files.file[0].path);
      }

      const lesson = await CourseLessonService.create({
        ...req.body,
        courseId,
        video,
        url: file, // ذخیره فایل اضافی در فیلد url
        fileType: fileType ?? undefined,
        fileSize: fileSize ?? undefined,
      });

      return res.status(201).json({ success: true, data: lesson });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: "Could not create lesson" });
    }
  }

  static async getByCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      if (!courseId) return res.status(400).json({ success: false, message: "courseId is required" });

      const numericCourseId = Number(courseId);
      if (isNaN(numericCourseId)) return res.status(400).json({ success: false, message: "courseId must be a number" });

      const lessons = await CourseLessonService.getByCourse(numericCourseId);
      return res.json({ success: true, data: lessons });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}
