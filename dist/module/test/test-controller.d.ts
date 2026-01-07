import { Request, Response } from "express";
export declare class TestController {
    /**
     * Create a new test for a course
     */
    static createTest(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Add a question to a test
     */
    static addQuestion(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Add an answer to a question
     */
    static addAnswer(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get test by ID
     */
    static getTestById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all tests for a course
     */
    static getTestsByCourse(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Submit test answers
     */
    static submitTest(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user's test attempts
     */
    static getUserTestAttempts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user's total points
     */
    static getUserTotalPoints(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=test-controller.d.ts.map