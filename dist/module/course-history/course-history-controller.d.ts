import { Request, Response } from "express";
import { AuthRequest } from "../../common/midlewere/auth";
export declare class CourseHistoryController {
    /**
     * Track when a user views a course
     * POST /course-history
     * Body: { courseId: number }
     */
    static trackCourseView(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all courses that the authenticated user has viewed
     * GET /course-history/my-history
     */
    static getMyCourseHistory(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get course history for a specific user
     * GET /course-history/user/:userId
     */
    static getUserCourseHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Check if user has viewed a specific course
     * GET /course-history/check/:courseId
     */
    static checkCourseViewed(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all users who viewed a specific course
     * GET /course-history/course/:courseId/viewers
     */
    static getCourseViewers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=course-history-controller.d.ts.map