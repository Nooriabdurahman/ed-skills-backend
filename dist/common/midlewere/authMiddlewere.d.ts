import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface User {
            id: number;
            email?: string;
        }
    }
}
export type AuthRequest = Request;
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void | Response;
//# sourceMappingURL=authMiddlewere.d.ts.map