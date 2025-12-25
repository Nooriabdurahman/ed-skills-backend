import { Request, Response, NextFunction } from "express";

/**
 * Middleware to validate the Create Course Progress request body.
 * This follows the separation of concerns by handling input
 * validation before it ever touches your business logic (service).
 */
export const validateCreateProgress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, lessonId } = req.body;

  // 1. Check if fields exist
  if (userId === undefined || lessonId === undefined) {
    return res.status(400).json({
      success: false,
      message: "Both userId and lessonId are required.",
    });
  }

  // 2. Ensure fields are numbers
  // Note: We use typeof because Prisma expects 'Int' for these fields
  if (typeof userId !== "number" || typeof lessonId !== "number") {
    return res.status(400).json({
      success: false,
      message: "Invalid data types. userId and lessonId must be numbers.",
    });
  }

  // 3. Optional: Ensure numbers are positive integers
  if (userId <= 0 || lessonId <= 0) {
    return res.status(400).json({
      success: false,
      message: "IDs must be positive integers.",
    });
  }

  // If all checks pass, move to the next middleware or controller
  return next();
};