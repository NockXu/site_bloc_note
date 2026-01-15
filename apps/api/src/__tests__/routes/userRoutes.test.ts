import request from 'supertest';
import app from '../../app';
import { prismaMock } from '../jest.setup';
import { Prisma } from '@prisma/client';

describe('User Routes', () => {
  describe('GET /api/users', () => {
    it('should return 200 for getting all users', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', password: 'pass1', notes: [] },
        { id: 2, username: 'user2', password: 'pass2', notes: [] }
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      await request(app)
        .get('/api/users')
        .expect(200);
    });
  });

  describe('POST /api/users', () => {
    it('should return 201 for creating a user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const mockUser = { id: 1, ...userData };
      prismaMock.user.create.mockResolvedValue(mockUser);

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 for non-existent user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await request(app)
        .get('/api/users/99999')
        .expect(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should return 404 for updating non-existent user', async () => {
      const updateData = {
        username: 'updateduser',
        password: 'newpassword123'
      };

      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '6.19.2' }
      );
      prismaMock.user.update.mockRejectedValue(notFoundError);

      await request(app)
        .put('/api/users/99999')
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 404 for deleting non-existent user', async () => {
      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '6.19.2' }
      );
      prismaMock.user.delete.mockRejectedValue(notFoundError);

      await request(app)
        .delete('/api/users/99999')
        .expect(404);
    });
  });
});
