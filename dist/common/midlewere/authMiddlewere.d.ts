import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email?: string;
    } | undefined;
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void | Response;
//# sourceMappingURL=authMiddlewere.d.ts.map