import request from 'supertest';
import app from '../../app';
import { prismaMock } from '../jest.setup';
import { Prisma } from '@prisma/client';

describe('User Controller', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const mockUser = { id: 1, ...userData };
      prismaMock.user.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: userData
      });
    });

    it('should return 400 for missing username', async () => {
      const userData = {
        password: 'password123'
      };

      const validationError = new Prisma.PrismaClientValidationError(
        'Validation error: username is required',
        { clientVersion: '6.19.2' }
      );
      prismaMock.user.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid data provided');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, username: 'testuser1', password: 'password123', notes: [] },
        { id: 2, username: 'testuser2', password: 'password456', notes: [] }
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body).toEqual(mockUsers);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password123',
        notes: []
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/1')
        .expect(200);

      expect(response.body).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { notes: true }
      });
    });

    it('should return 404 for non-existent user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users/99999')
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const updateData = {
        username: 'updateduser',
        password: 'newpassword123'
      };

      const mockUpdatedUser = { id: 1, ...updateData };
      prismaMock.user.update.mockResolvedValue(mockUpdatedUser);

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData
      });
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = {
        username: 'updateduser',
        password: 'newpassword123'
      };

      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '6.19.2' }
      );
      prismaMock.user.update.mockRejectedValue(notFoundError);

      const response = await request(app)
        .put('/api/users/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const mockDeletedUser = {
        id: 1,
        username: 'testuser',
        password: 'password123'
      };

      prismaMock.user.delete.mockResolvedValue(mockDeletedUser);

      const response = await request(app)
        .delete('/api/users/1')
        .expect(200);

      expect(response.body).toEqual(mockDeletedUser);
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 404 for non-existent user', async () => {
      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '6.19.2' }
      );
      prismaMock.user.delete.mockRejectedValue(notFoundError);

      const response = await request(app)
        .delete('/api/users/99999')
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });
});
