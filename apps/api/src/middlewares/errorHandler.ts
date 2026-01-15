/**
 * @filedesc Global error handler
 * @description Express middleware for centralized error management
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Interface for application errors
 * @extends Error
 */
export interface AppError extends Error {
  status?: number;  // Optional HTTP error code
  code?: string;    // Prisma error code
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

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      // Record not found
      return res.status(404).json({
        message: 'User not found',
      });
    }
    if (err.code === 'P2002') {
      // Unique constraint violation
      return res.status(409).json({
        message: 'Resource already exists',
      });
    }
    if (err.code === 'P2003') {
      // Foreign key constraint violation
      return res.status(400).json({
        message: 'Invalid reference',
      });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: 'Invalid data provided',
    });
  }

  // Send error response to client
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
