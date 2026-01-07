import { Request, Response } from "express";
export declare class QuizController {
    /**
     * Create a new quiz for a course
     */
    static createQuiz(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Add a question to a quiz
     */
    static addQuestion(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Add an answer to a question
     */
    static addAnswer(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get quiz by ID
     */
    static getQuizById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all quizzes for a course
     */
    static getQuizzesByCourse(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Submit quiz answers and get badge
     */
    static submitQuiz(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user's quiz attempts
     */
    static getUserQuizAttempts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user's badges
     */
    static getUserBadges(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=quiz-controller.d.ts.map