/**
 * @filedesc Application configuration
 * @description Manages environment variables and global configuration
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Interface for application configuration
 */
interface Config {
  port: number;    // Server listening port
  nodeEnv: string; // Environment (development, production, etc.)
}

/**
 * Application configuration with default values
 */
const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
