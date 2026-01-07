import { Request, Response } from "express";
export declare class BadgeController {
    /**
     * Create a new badge
     */
    static createBadge(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all badges
     */
    static getAllBadges(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get badge by ID
     */
    static getBadgeById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update badge
     */
    static updateBadge(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete badge
     */
    static deleteBadge(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=badge-controller.d.ts.map