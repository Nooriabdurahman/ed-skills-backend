import { Request, Response, NextFunction } from "express";
/**
 * Middleware to validate the Create Course Progress request body.
 * This follows the separation of concerns by handling input
 * validation before it ever touches your business logic (service).
 */
export declare const validateCreateProgress: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=prograss-validation.d.ts.map