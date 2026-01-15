/**
 * @filedesc Main Express application
 * @description Configures Express app with routes and middlewares
 */

import express from 'express';
import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './config/swagger';

// Create Express application
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// Configure API routes
app.use('/api/users', userRoutes);  // User routes
app.use('/api/notes', noteRoutes);  // Note routes

// Global error handler (must be after routes)
app.use(errorHandler);

export default app;
