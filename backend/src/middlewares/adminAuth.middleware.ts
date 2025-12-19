import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js'; 
import User from '../models/User.js';
import { AdminRole } from '../../types.js';

const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(401).json({ msg: 'Authentication required, no user found.' });
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
    res.status(500).json({ msg: 'Server Error in admin authentication.' });
  }
};

export default adminAuth;