/**
 * @filedesc Global error handler
 * @description Express middleware for centralized error management
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Interface for application errors
 * @extends Error
 */
export interface AppError extends Error {
  status?: number;  // Optional HTTP error code
}

/**
 * Global error handling middleware
 * @param err - Error to handle
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error(err);
  
  // Send error response to client
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
