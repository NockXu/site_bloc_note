/**
 * @filedesc Prisma database configuration
 * @description Initializes and exports Prisma client with singleton pattern
 */

import { PrismaClient } from '@prisma/client';

// Global declaration to avoid multiple connections in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Unique Prisma client instance (singleton pattern)
 * Creates new instance if doesn't exist, otherwise reuses existing one
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, store instance in global to avoid reconnections
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
