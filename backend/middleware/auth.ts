import express from 'express';
// FIX: Corrected import path for AuthRequest.
import { AuthRequest } from '../src/middlewares/auth.middleware.js'; 
// FIX: Corrected import path for User model
import User from '../src/models/User.js'; 
import { AdminRole } from '../../types.js';

// FIX: Use express.Response and express.NextFunction
export default async function(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  try {
    if (!req.user) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(401).json({ msg: 'Authentication required' });
    }
    const user = await User.findById(req.user.id).select('role');
    
    if (!user || user.role === 'user' || !Object.values(AdminRole).includes(user.role as AdminRole)) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(403).json({ msg: 'Access denied. Admin role required.' });
    }
    
    next();
  } catch (err: any) {
    console.error('Admin auth middleware error:', err.message);
    // FIX: Property 'status' does not exist on type 'Response'.
    res.status(500).json({ msg: 'Server Error' });
  }
}