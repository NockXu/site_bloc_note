/**
 * @filedesc Main Express application
 * @description Configures Express app with routes and middlewares
 */

import express from 'express';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import healthRoutes from './routes/health.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { setupSwagger } from './config/swagger.js';

// Create Express application
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// Configure API routes
app.use('/api/users', userRoutes);  // User routes
app.use('/api/notes', noteRoutes);  // Note routes
app.use('/health', healthRoutes);     // Health check routes

// Global error handler (must be after routes)
app.use(errorHandler);

export default app;
