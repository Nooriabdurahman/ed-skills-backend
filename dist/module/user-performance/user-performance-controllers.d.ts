import { Request, Response } from "express";
export declare class UserPerformanceController {
    /**
     * Start lesson activity
     */
    static startLessonActivity(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * End lesson activity
     */
    static endLessonActivity(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user stats
     */
    static getUserStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=user-performance-controllers.d.ts.map