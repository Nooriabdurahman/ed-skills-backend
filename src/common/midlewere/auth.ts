import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ error: 'JWT secret not configured' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      const payload = decoded as { id: number };
      req.user = { id: payload.id }; // ✅ userId from token
      next();
    } else {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};
