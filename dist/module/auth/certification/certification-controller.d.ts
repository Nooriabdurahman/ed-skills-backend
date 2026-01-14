import { Request, Response } from "express";
export declare class CertificationController {
    /**
     * Award certification to user
     */
    static awardCertification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Check and award certification if course is completed
     */
    static checkAndAwardCertification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user's certifications
     */
    static getUserCertifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get certification by ID
     */
    static getCertificationById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get certifications for a course
     */
    static getCourseCertifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=certification-controller.d.ts.map