import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface User {
      id: number;
      email?: string;
    }
  }
}

export type AuthRequest = Request;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  const secret = process.env.JWT_SECRET ?? 'your-secret-key';

  try {
    const decoded = jwt.verify(token, secret) as any;
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
