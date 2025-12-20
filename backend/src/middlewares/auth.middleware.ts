import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
export type AuthRequest = Request & {
  user?: {
    id: string;
  };
};

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['x-auth-token'] as string;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined.');
    }
    
    const decoded = jwt.verify(token, jwtSecret) as { user: { id: string } };
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};