import { prisma } from './database';

/**
 * Database health check utility
 */
export class DatabaseHealthCheck {
  /**
   * Check if database connection is working
   * @returns Promise<boolean> - true if connection is healthy
   */
  static async isHealthy(): Promise<boolean> {
    try {
      // Simple query to test connection
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Get database statistics
   * @returns Promise<object> - Database stats
   */
  static async getStats(): Promise<object> {
    try {
      const [userCount, noteCount] = await Promise.all([
        prisma.user.count(),
        prisma.note.count()
      ]);

      return {
        users: userCount,
        notes: noteCount,
        lastCheck: new Date().toISOString(),
        status: 'healthy'
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return {
        users: 0,
        notes: 0,
        lastCheck: new Date().toISOString(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test database operations
   * @returns Promise<object> - Test results
   */
  static async testOperations(): Promise<object> {
    const results = {
      connection: false,
      read: false,
      write: false,
      delete: false,
      error: null as string | null
    };

    try {
      // Test connection
      await prisma.$queryRaw`SELECT 1`;
      results.connection = true;

      // Test read
      const userCount = await prisma.user.count();
      results.read = true;

      // Test write
      const testUser = await prisma.user.create({
        data: {
          username: `health_check_${Date.now()}`,
          password: 'test_password'
        }
      });
      results.write = true;

      // Test delete
      await prisma.user.delete({
        where: { id: testUser.id }
      });
      results.delete = true;

    } catch (error) {
      results.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Database operations test failed:', error);
    }

    return results;
  }
}
