import { Request, Response } from "express";
import { AuthRequest } from "../../common/midlewere/auth";
export declare class QuizHistoryController {
    /**
     * Get quiz history for authenticated user
     * GET /quiz-history/my-history
     */
    static getMyQuizHistory(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get quiz history for a specific user
     * GET /quiz-history/user/:userId
     */
    static getUserQuizHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all quiz history (admin)
     * GET /quiz-history
     */
    static getAllQuizHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get quiz history for a specific quiz
     * GET /quiz-history/quiz/:quizId
     */
    static getQuizHistoryByQuizId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get quiz history for a specific course
     * GET /quiz-history/course/:courseId
     */
    static getQuizHistoryByCourseId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=quiz-history-controller.d.ts.map