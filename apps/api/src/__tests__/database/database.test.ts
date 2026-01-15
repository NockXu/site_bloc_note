import { prisma } from '../../config/database';

describe('Database Connection', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Prisma Client', () => {
    it('should connect to database successfully', async () => {
      // Test basic connection by trying to query the database
      const result = await prisma.user.findMany();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle database operations', async () => {
      // Test creating and querying data
      const testUser = await prisma.user.create({
        data: {
          username: 'test_db_user',
          password: 'test_password'
        }
      });

      expect(testUser).toHaveProperty('id');
      expect(testUser.username).toBe('test_db_user');

      // Clean up
      await prisma.user.delete({
        where: { id: testUser.id }
      });
    });

    it('should handle transaction operations', async () => {
      // Test transaction with multiple operations
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            username: 'transaction_user',
            password: 'test_password'
          }
        });

        const note = await tx.note.create({
          data: {
            titre: 'Transaction Note',
            contenu: 'Created in transaction',
            userId: user.id
          }
        });

        return { user, note };
      });

      expect(result.user).toHaveProperty('id');
      expect(result.note).toHaveProperty('id');
      expect(result.note.userId).toBe(result.user.id);

      // Clean up
      await prisma.note.delete({
        where: { id: result.note.id }
      });
      await prisma.user.delete({
        where: { id: result.user.id }
      });
    });
  });

  describe('Database Health Check', () => {
    it('should perform health check operations', async () => {
      // Test basic database operations
      const userCount = await prisma.user.count();
      const noteCount = await prisma.note.count();

      expect(typeof userCount).toBe('number');
      expect(typeof noteCount).toBe('number');
      expect(userCount).toBeGreaterThanOrEqual(0);
      expect(noteCount).toBeGreaterThanOrEqual(0);
    });

    it('should handle concurrent operations', async () => {
      // Test multiple concurrent operations
      const promises = Array.from({ length: 5 }, (_, i) =>
        prisma.user.create({
          data: {
            username: `concurrent_user_${i}`,
            password: 'test_password'
          }
        })
      );

      const users = await Promise.all(promises);
      expect(users).toHaveLength(5);

      // Clean up all created users
      await prisma.user.deleteMany({
        where: {
          username: {
            startsWith: 'concurrent_user_'
          }
        }
      });
    });
  });
});
