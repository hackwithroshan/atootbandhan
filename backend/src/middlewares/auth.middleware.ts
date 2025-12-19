// FIX: Using explicit express import to avoid type conflicts with global types.
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
// FIX: Changed from `extends ExpressRequest` to `extends Request` and updated the import. This ensures AuthRequest correctly inherits properties like .headers, .body, and .params from the base Express Request type.
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// FIX: Using express.Response and express.NextFunction to ensure correct types.
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  // FIX: Use req.headers to access the token. The `header` method might not be available
  // on the Request type depending on the @types/express version.
  // FIX: Property 'headers' does not exist on type 'AuthRequest'. Corrected by extending express.Request
  const token = req.headers['x-auth-token'] as string;

  if (!token) {
    // FIX: Property 'status' does not exist on type 'Response'.
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
    // FIX: Property 'status' does not exist on type 'Response'.
    res.status(401).json({ msg: 'Token is not valid' });
  }
};