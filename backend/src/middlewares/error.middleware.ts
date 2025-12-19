// FIX: Changed to explicit express import to resolve type conflicts.
import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the full error stack for debugging

  // Send a generic error message to the client
  // FIX: Property 'status' does not exist on type 'Response'. Corrected by using explicit express types.
  res.status(500).json({
    msg: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
  });
};

export default errorMiddleware;